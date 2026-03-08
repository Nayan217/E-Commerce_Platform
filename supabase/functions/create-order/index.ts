import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User client to verify auth
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for trusted operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const {
      items,
      shipping_address,
      billing_address,
      shipping_method,
      notes,
      coupon_code,
    } = body;

    // Validate items exist
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate shipping address
    if (!shipping_address || !shipping_address.name || !shipping_address.line1 || !shipping_address.city || !shipping_address.state || !shipping_address.pin) {
      return new Response(JSON.stringify({ error: "Invalid shipping address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch real product prices from DB
    const productIds = [...new Set(items.map((i: any) => i.product_id))];
    const { data: products, error: prodError } = await adminClient
      .from("products")
      .select("id, name, price, variants, images, is_active")
      .in("id", productIds);

    if (prodError || !products) {
      return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));

    // Validate each item and calculate server-side subtotal
    const validatedItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product || !product.is_active) {
        return new Response(
          JSON.stringify({ error: `Product not found or inactive: ${item.product_id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const variants = (product.variants || []) as any[];
      const variant = variants.find((v: any) => v.sku === item.variant_sku);

      // Use variant price if available, otherwise product price
      const unitPrice = variant?.price ?? product.price;
      const qty = Math.max(1, Math.min(parseInt(item.qty) || 1, 99));

      // Stock check
      if (variant && variant.stock < qty) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${product.name} (${variant.size}/${variant.color}). Available: ${variant.stock}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const images = (product.images || []) as any[];
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        product_id: item.product_id,
        variant_sku: item.variant_sku || "",
        name: product.name,
        image: images[0]?.url || "",
        price: unitPrice,
        qty,
        size: item.size || "",
        color: item.color || "",
      });
    }

    // Calculate shipping
    let shippingCost = 0;
    if (shipping_method === "express") shippingCost = 99;
    else if (shipping_method === "next-day") shippingCost = 199;
    else shippingCost = subtotal >= 999 ? 0 : 99; // standard: free over ₹999

    // Tax (18% GST)
    const tax = Math.round(subtotal * 0.18);

    // Apply coupon
    let discount = 0;
    let appliedCoupon: string | null = null;

    if (coupon_code) {
      const { data: coupon } = await adminClient
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (coupon) {
        const now = new Date();
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > now;
        const notMaxed = !coupon.max_uses || (coupon.used_count || 0) < coupon.max_uses;
        const meetsMin = subtotal >= (coupon.min_order_amount || 0);

        if (notExpired && notMaxed && meetsMin) {
          if (coupon.discount_type === "percentage") {
            discount = Math.round(subtotal * (coupon.discount_value / 100));
          } else {
            discount = Math.min(coupon.discount_value, subtotal);
          }
          appliedCoupon = coupon.code;

          // Increment used_count
          await adminClient
            .from("coupons")
            .update({ used_count: (coupon.used_count || 0) + 1 })
            .eq("id", coupon.id);
        }
      }
    }

    const total = subtotal + shippingCost + tax - discount;

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

    // Insert order with safe defaults (status=pending, payment_status=unpaid)
    const { data: order, error: insertError } = await adminClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        items: validatedItems,
        status: "pending",
        payment_status: "unpaid",
        payment_method: "cod",
        shipping_address,
        billing_address: billing_address || shipping_address,
        subtotal,
        tax,
        shipping_cost: shippingCost,
        discount,
        coupon_code: appliedCoupon,
        total,
        notes: notes ? String(notes).slice(0, 500) : null,
        status_history: [{ status: "pending", timestamp: new Date().toISOString() }],
      })
      .select("id, order_number, total")
      .single();

    if (insertError) {
      console.error("Order insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Clear user cart
    await adminClient.from("carts").delete().eq("user_id", user.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        order_number: order.order_number,
        total: order.total,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("create-order error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
