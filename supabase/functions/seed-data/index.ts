import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: string[] = [];

    // ── 0. Fix admin email confirmation ───────────────────────────
    const adminId = "0f56da34-4ea2-4ca9-8482-40b1fff0b46b"; // existing admin
    const { error: adminFixErr } = await supabaseAdmin.auth.admin.updateUserById(adminId, {
      email_confirm: true,
      password: "Admin@1234",
    });
    if (!adminFixErr) results.push("Admin email confirmed & password set to Admin@1234");
    else results.push(`Admin fix: ${adminFixErr.message}`);

    // ── 1. Create test users ──────────────────────────────────────

    // Create customer1
    const { data: c1 } = await supabaseAdmin.auth.admin.createUser({
      email: "customer1@shopflow.com",
      password: "Test@1234",
      email_confirm: true,
      user_metadata: { full_name: "Rahul Sharma" },
    });
    const customer1Id = c1?.user?.id;
    if (customer1Id) results.push(`Created customer1: ${customer1Id}`);
    else results.push("customer1 may already exist");

    // Create customer2
    const { data: c2 } = await supabaseAdmin.auth.admin.createUser({
      email: "customer2@shopflow.com",
      password: "Test@1234",
      email_confirm: true,
      user_metadata: { full_name: "Priya Patel" },
    });
    const customer2Id = c2?.user?.id;
    if (customer2Id) results.push(`Created customer2: ${customer2Id}`);
    else results.push("customer2 may already exist");

    // If users already exist, look them up
    let user1Id = customer1Id;
    let user2Id = customer2Id;

    if (!user1Id) {
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      const found = data?.users?.find(
        (u) => u.email === "customer1@shopflow.com"
      );
      user1Id = found?.id;
    }
    if (!user2Id) {
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      const found = data?.users?.find(
        (u) => u.email === "customer2@shopflow.com"
      );
      user2Id = found?.id;
    }

    if (!user1Id || !user2Id) {
      return new Response(
        JSON.stringify({
          error: "Could not find/create test users",
          results,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Product IDs ───────────────────────────────────────────────
    const productIds = {
      boatAirdopes: "254b9a5c-5717-44fc-8ef0-e4b7bdddc668",
      sonyXm5: "37b10e9c-96d8-4ec5-bbf6-a2f6160ccd08",
      samsungS24: "66f78c0c-b38c-481e-91bd-74d07452c012",
      hpPavilion: "770d3e5d-20fc-4f91-ae69-38bd05756488",
      nikeAirMax: "1411ecf0-4445-4634-84e9-2f36e14c97a8",
      levisJeans: "9d708fba-27fd-40a8-aabc-f0e6800a9396",
      allenSolly: "02f02311-cd50-4375-babb-beaf97e3fea2",
      usPolo: "7a4d1d7f-80c6-4307-8b69-d277de0154da",
      atomicHabits: "c311abbd-6f90-4b0f-a9ff-c199db34e0bd",
      richDad: "870cae9f-ee6f-4fa8-b627-adbe27d3f3cf",
      psychologyMoney: "ca313606-2d79-41a0-a989-991e461d0182",
      ikigai: "0b226397-fab6-4a1b-91f2-e5da011fc5a0",
      macLipstick: "919ccd9f-0bcc-4206-a30c-2fab05e1cfa3",
      philipsPurifier: "ab16b6a3-cdf1-45da-ab82-857f2455c457",
      pigeonCooker: "ce5c2d2d-2175-4b4e-b0de-a65985b14431",
      bombayBedsheet: "be413384-e0f3-43be-9a35-f8ed95c8eb55",
      urbanLamp: "57c62356-9d48-410a-9b94-4b5bba7d5fb3",
      yogaMat: "fec1e830-85e5-4432-9946-15b5d2a672c5",
      biotique: "56be1c6c-871e-4d0f-b5cf-8db83f70f9c1",
      fitbit: "0ef21bbf-90f6-4639-a7d7-73b5ec70964f",
    };

    // ── 2. Addresses ──────────────────────────────────────────────
    const addresses = [
      {
        user_id: user1Id,
        full_name: "Rahul Sharma",
        phone: "+91 9876543210",
        line1: "42, MG Road, Koramangala",
        line2: "Near Forum Mall",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560034",
        country: "India",
        label: "Home",
        is_default: true,
      },
      {
        user_id: user1Id,
        full_name: "Rahul Sharma",
        phone: "+91 9876543210",
        line1: "Tech Park, Whitefield",
        line2: "Building 4, Floor 3",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560066",
        country: "India",
        label: "Work",
        is_default: false,
      },
      {
        user_id: user2Id,
        full_name: "Priya Patel",
        phone: "+91 9123456789",
        line1: "15, Linking Road, Bandra West",
        line2: "",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400050",
        country: "India",
        label: "Home",
        is_default: true,
      },
      {
        user_id: user2Id,
        full_name: "Priya Patel",
        phone: "+91 9123456789",
        line1: "BKC Complex, G Block",
        line2: "Tower B, 12th Floor",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400051",
        country: "India",
        label: "Work",
        is_default: false,
      },
      {
        user_id: adminId,
        full_name: "Admin User",
        phone: "+91 9000000000",
        line1: "ShopFlow HQ, Sector 5",
        line2: "Electronic City",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560100",
        country: "India",
        label: "Office",
        is_default: true,
      },
    ];

    const { error: addrErr } = await supabaseAdmin
      .from("addresses")
      .upsert(addresses, { onConflict: "id" });
    results.push(addrErr ? `Addresses error: ${addrErr.message}` : "Addresses inserted");

    // ── 3. Reviews ────────────────────────────────────────────────
    const reviews = [
      // Customer 1 reviews
      { user_id: user1Id, product_id: productIds.boatAirdopes, rating: 4, title: "Great value for money", body: "Amazing sound quality at this price point. Battery life is impressive. The bass is deep and the overall audio experience is very satisfying.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.sonyXm5, rating: 5, title: "Best headphones ever", body: "Noise cancellation is absolutely phenomenal. Worth every rupee spent. The sound quality is studio-grade and comfort is unmatched for long listening sessions.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.nikeAirMax, rating: 5, title: "Super comfortable", body: "Perfect fit, great cushioning. I wear these daily for walks and gym. The air max unit provides excellent shock absorption.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.atomicHabits, rating: 5, title: "Life-changing book", body: "Must read for everyone who wants to build better habits. The 1% improvement concept really resonated with me. I've already started implementing the strategies.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.hpPavilion, rating: 4, title: "Solid laptop for the price", body: "Great for everyday use and light gaming. The display is bright and keyboard is comfortable to type on. Only wish it had better speakers.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.yogaMat, rating: 4, title: "Good quality mat", body: "Non-slip surface works well. Thickness is just right for floor exercises. Easy to roll up and carry.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.pigeonCooker, rating: 5, title: "Kitchen essential", body: "Works perfectly for daily cooking. Whistle is loud and clear. Great build quality for the price.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.fitbit, rating: 4, title: "Excellent fitness tracker", body: "Accurate heart rate monitoring and step tracking. The sleep analysis feature is very insightful. Battery lasts about 5 days.", verified_purchase: true },

      // Customer 2 reviews
      { user_id: user2Id, product_id: productIds.samsungS24, rating: 5, title: "Fantastic phone", body: "Camera quality is stunning, especially in low light. The AI features are genuinely useful, not just gimmicks. Battery easily lasts a full day.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.macLipstick, rating: 5, title: "My go-to lipstick", body: "The color is absolutely gorgeous and stays on for hours. Doesn't dry out lips like other matte lipsticks. Worth the premium price.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.levisJeans, rating: 4, title: "Perfect fit", body: "The slim fit is very flattering. Fabric quality is excellent and doesn't stretch out. True to size ordering.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.richDad, rating: 5, title: "Changed my financial mindset", body: "Essential reading for anyone wanting to understand money. The concepts about assets and liabilities completely changed how I think about spending.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.biotique, rating: 4, title: "Gentle on hair", body: "Love the herbal formula. My hair feels softer and more manageable after just a week of use. No harsh chemicals.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.bombayBedsheet, rating: 4, title: "Beautiful design", body: "Colors are vibrant and the cotton is very soft. Washes well without fading. Perfect for our bedroom decor.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.allenSolly, rating: 4, title: "Great formal shirt", body: "Fabric feels premium. Slim fit works well for office wear. The collar stays crisp even after washing.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.philipsPurifier, rating: 5, title: "Breathing easier now", body: "Noticeable difference in air quality within hours. Very quiet operation, perfect for bedroom use. The filter indicator is helpful.", verified_purchase: true },

      // Admin reviews (mixed)
      { user_id: adminId, product_id: productIds.boatAirdopes, rating: 3, title: "Decent for the price", body: "Sound is okay but not amazing. Battery life is good. Touch controls can be finicky sometimes but overall acceptable for casual listening.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.samsungS24, rating: 4, title: "Great upgrade", body: "Significant improvements over the previous generation. The display is gorgeous and performance is snappy. Camera AI features are impressive.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.ikigai, rating: 5, title: "Beautiful philosophy", body: "A calming and insightful read about finding purpose and meaning. The Japanese wisdom presented here is timeless and practical.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.usPolo, rating: 4, title: "Classic polo style", body: "Good quality cotton, comfortable fit. Colors don't fade after multiple washes. Great casual wear option.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.urbanLamp, rating: 5, title: "Statement piece", body: "Adds a wonderful ambiance to the room. Build quality is excellent. The lighting is warm and inviting.", verified_purchase: false },

      // More reviews for variety
      { user_id: user1Id, product_id: productIds.psychologyMoney, rating: 5, title: "Brilliant insights", body: "Morgan Housel explains complex financial concepts through wonderful stories. Each chapter is a standalone lesson about money and behavior.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.boatAirdopes, rating: 4, title: "Impressed!", body: "For this price range, these earbuds are unbeatable. Good bass, decent noise isolation, and very comfortable for long use.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.nikeAirMax, rating: 5, title: "Stylish and comfy", body: "These look amazing with any outfit. The cushioning makes walking on hard surfaces a breeze. Already ordered another pair!", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.ikigai, rating: 4, title: "Peaceful read", body: "A short but impactful book. The lessons about finding your purpose are simple yet profound. Highly recommend for anyone feeling lost.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.urbanLamp, rating: 4, title: "Elegant lighting", body: "Transforms the corner of my living room. Assembly was easy and the design is modern yet warm.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.fitbit, rating: 5, title: "Love my Fitbit!", body: "The health tracking features are comprehensive. GPS is accurate for runs. The app integration is seamless.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.yogaMat, rating: 3, title: "Does the job", body: "Basic yoga mat, nothing special. Adequate thickness but could be more cushioned. Good for beginners.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.allenSolly, rating: 5, title: "Office favourite", body: "Bought three in different colors. The fabric is breathable and perfect for Indian summers. Excellent stitching quality.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.biotique, rating: 4, title: "Natural goodness", body: "Love that it's chemical-free. My dandruff has reduced significantly. Smells fresh and herbal.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.hpPavilion, rating: 4, title: "Reliable workhorse", body: "Handles multitasking well. The 512GB SSD is fast. Good for work-from-home setup. Fan gets a bit loud under load.", verified_purchase: true },
      { user_id: adminId, product_id: productIds.levisJeans, rating: 5, title: "Classic Levi's quality", body: "Can never go wrong with 511s. The stretch denim is comfortable all day. Great durability.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.pigeonCooker, rating: 4, title: "Reliable cookware", body: "Been using for months, no issues. Sealing ring is durable. Cooks rice perfectly every time.", verified_purchase: false },
      { user_id: user1Id, product_id: productIds.macLipstick, rating: 5, title: "Gift for my wife", body: "My wife absolutely loves this shade. She says it's the most comfortable matte lipstick she's tried. Will buy more colors!", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.sonyXm5, rating: 5, title: "Worth the splurge", body: "Noise cancelling is on another level. Perfect for flights and noisy offices. Sound quality is pristine.", verified_purchase: true },
      { user_id: user1Id, product_id: productIds.samsungS24, rating: 4, title: "Excellent all-rounder", body: "Galaxy AI is genuinely useful. Camera, display, performance — all top-notch. Wish the charging was faster though.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.psychologyMoney, rating: 4, title: "Must read for millennials", body: "Great perspective on wealth building. The stories make financial concepts accessible. Changed how I think about saving.", verified_purchase: true },
      { user_id: adminId, product_id: productIds.macLipstick, rating: 4, title: "Iconic shade", body: "Ruby Woo is truly iconic. Great pigmentation and the matte finish is beautiful. Packaging is luxurious.", verified_purchase: false },
      { user_id: adminId, product_id: productIds.fitbit, rating: 4, title: "Great daily companion", body: "Helpful for maintaining fitness goals. The notifications are convenient. Would love longer battery life though.", verified_purchase: false },
      { user_id: user1Id, product_id: productIds.richDad, rating: 4, title: "Eye-opening concepts", body: "The cashflow quadrant concept is brilliant. Makes you rethink your career and investment approach. A bit repetitive but important lessons.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.usPolo, rating: 4, title: "Casual classic", body: "Soft cotton, nice fit. The logo embroidery is neat. Good value compared to premium polo brands.", verified_purchase: true },
      { user_id: user2Id, product_id: productIds.urbanLamp, rating: 5, title: "Room transformation", body: "This lamp is a conversation starter. The warm glow creates the perfect ambiance for evening relaxation.", verified_purchase: true },
    ];

    const { error: revErr } = await supabaseAdmin.from("reviews").insert(reviews);
    results.push(revErr ? `Reviews error: ${revErr.message}` : `${reviews.length} reviews inserted`);

    // ── 4. Wishlists ──────────────────────────────────────────────
    const wishlists = [
      { user_id: user1Id, product_id: productIds.samsungS24 },
      { user_id: user1Id, product_id: productIds.philipsPurifier },
      { user_id: user1Id, product_id: productIds.macLipstick },
      { user_id: user1Id, product_id: productIds.levisJeans },
      { user_id: user1Id, product_id: productIds.urbanLamp },
      { user_id: user2Id, product_id: productIds.sonyXm5 },
      { user_id: user2Id, product_id: productIds.atomicHabits },
      { user_id: user2Id, product_id: productIds.yogaMat },
      { user_id: user2Id, product_id: productIds.hpPavilion },
      { user_id: user2Id, product_id: productIds.usPolo },
      { user_id: user2Id, product_id: productIds.pigeonCooker },
      { user_id: adminId, product_id: productIds.samsungS24 },
      { user_id: adminId, product_id: productIds.sonyXm5 },
      { user_id: adminId, product_id: productIds.nikeAirMax },
    ];

    const { error: wishErr } = await supabaseAdmin.from("wishlists").insert(wishlists);
    results.push(wishErr ? `Wishlists error: ${wishErr.message}` : `${wishlists.length} wishlist items inserted`);

    // ── 5. Orders ─────────────────────────────────────────────────
    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

    const orders = [
      {
        user_id: user1Id,
        order_number: "SF-20260301-001",
        status: "delivered",
        payment_status: "paid",
        payment_method: "card",
        items: JSON.stringify([
          { productId: productIds.boatAirdopes, name: "boAt Airdopes 141", image: "/placeholder.svg", price: 1299, qty: 1, size: "One Size", color: "Black" },
          { productId: productIds.atomicHabits, name: "Atomic Habits", image: "/placeholder.svg", price: 350, qty: 1, size: "Paperback", color: "N/A" },
        ]),
        subtotal: 1649,
        tax: 297,
        shipping_cost: 0,
        discount: 0,
        total: 1946,
        shipping_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "42, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pin: "560034", country: "India" }),
        billing_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "42, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pin: "560034", country: "India" }),
        tracking_number: "DTDC1234567890",
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(15), completed: true },
          { status: "paid", date: daysAgo(15), completed: true },
          { status: "processing", date: daysAgo(14), completed: true },
          { status: "shipped", date: daysAgo(12), completed: true },
          { status: "delivered", date: daysAgo(8), completed: true },
        ]),
        created_at: daysAgo(15),
      },
      {
        user_id: user1Id,
        order_number: "SF-20260305-002",
        status: "shipped",
        payment_status: "paid",
        payment_method: "upi",
        items: JSON.stringify([
          { productId: productIds.nikeAirMax, name: "Nike Air Max 270", image: "/placeholder.svg", price: 11495, qty: 1, size: "UK 9", color: "Black/White" },
        ]),
        subtotal: 11495,
        tax: 2069,
        shipping_cost: 0,
        discount: 0,
        total: 13564,
        shipping_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "Tech Park, Whitefield", city: "Bangalore", state: "Karnataka", pin: "560066", country: "India" }),
        billing_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "Tech Park, Whitefield", city: "Bangalore", state: "Karnataka", pin: "560066", country: "India" }),
        tracking_number: "BLUEDART9876543",
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(5), completed: true },
          { status: "paid", date: daysAgo(5), completed: true },
          { status: "processing", date: daysAgo(4), completed: true },
          { status: "shipped", date: daysAgo(2), completed: true },
          { status: "delivered", date: daysAgo(0), completed: false },
        ]),
        created_at: daysAgo(5),
      },
      {
        user_id: user2Id,
        order_number: "SF-20260228-003",
        status: "delivered",
        payment_status: "paid",
        payment_method: "card",
        items: JSON.stringify([
          { productId: productIds.macLipstick, name: "MAC Ruby Woo Lipstick", image: "/placeholder.svg", price: 1650, qty: 2, size: "3g", color: "Ruby Woo" },
          { productId: productIds.biotique, name: "Biotique Bio Kelp Shampoo", image: "/placeholder.svg", price: 225, qty: 1, size: "340ml", color: "N/A" },
        ]),
        subtotal: 3525,
        tax: 635,
        shipping_cost: 0,
        discount: 1058, // 30% welcome discount
        total: 3102,
        coupon_code: "WELCOME30",
        shipping_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "15, Linking Road, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", country: "India" }),
        billing_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "15, Linking Road, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", country: "India" }),
        tracking_number: "DELHIVERY5678901",
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(20), completed: true },
          { status: "paid", date: daysAgo(20), completed: true },
          { status: "processing", date: daysAgo(19), completed: true },
          { status: "shipped", date: daysAgo(17), completed: true },
          { status: "delivered", date: daysAgo(14), completed: true },
        ]),
        created_at: daysAgo(20),
      },
      {
        user_id: user2Id,
        order_number: "SF-20260307-004",
        status: "processing",
        payment_status: "paid",
        payment_method: "upi",
        items: JSON.stringify([
          { productId: productIds.samsungS24, name: "Samsung Galaxy S24 FE", image: "/placeholder.svg", price: 49999, qty: 1, size: "128GB", color: "Mint" },
        ]),
        subtotal: 49999,
        tax: 9000,
        shipping_cost: 0,
        discount: 10000, // 20% loyalty
        total: 48999,
        coupon_code: "LOYAL20",
        shipping_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "BKC Complex, G Block", city: "Mumbai", state: "Maharashtra", pin: "400051", country: "India" }),
        billing_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "BKC Complex, G Block", city: "Mumbai", state: "Maharashtra", pin: "400051", country: "India" }),
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(1), completed: true },
          { status: "paid", date: daysAgo(1), completed: true },
          { status: "processing", date: daysAgo(0), completed: true },
          { status: "shipped", date: "", completed: false },
          { status: "delivered", date: "", completed: false },
        ]),
        created_at: daysAgo(1),
      },
      {
        user_id: user1Id,
        order_number: "SF-20260306-005",
        status: "pending",
        payment_status: "unpaid",
        payment_method: "cod",
        items: JSON.stringify([
          { productId: productIds.psychologyMoney, name: "The Psychology of Money", image: "/placeholder.svg", price: 299, qty: 1, size: "Paperback", color: "N/A" },
          { productId: productIds.richDad, name: "Rich Dad Poor Dad", image: "/placeholder.svg", price: 350, qty: 1, size: "Paperback", color: "N/A" },
          { productId: productIds.ikigai, name: "Ikigai", image: "/placeholder.svg", price: 299, qty: 1, size: "Paperback", color: "N/A" },
        ]),
        subtotal: 948,
        tax: 171,
        shipping_cost: 49,
        discount: 0,
        total: 1168,
        shipping_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "42, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pin: "560034", country: "India" }),
        billing_address: JSON.stringify({ name: "Rahul Sharma", phone: "+91 9876543210", line1: "42, MG Road, Koramangala", city: "Bangalore", state: "Karnataka", pin: "560034", country: "India" }),
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(2), completed: true },
          { status: "paid", date: "", completed: false },
          { status: "processing", date: "", completed: false },
          { status: "shipped", date: "", completed: false },
          { status: "delivered", date: "", completed: false },
        ]),
        created_at: daysAgo(2),
      },
      {
        user_id: user2Id,
        order_number: "SF-20260220-006",
        status: "cancelled",
        payment_status: "refunded",
        payment_method: "card",
        items: JSON.stringify([
          { productId: productIds.hpPavilion, name: "HP Pavilion Laptop 15", image: "/placeholder.svg", price: 54990, qty: 1, size: "i5/8GB/512GB", color: "Silver" },
        ]),
        subtotal: 54990,
        tax: 9898,
        shipping_cost: 0,
        discount: 0,
        total: 64888,
        shipping_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "15, Linking Road, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", country: "India" }),
        billing_address: JSON.stringify({ name: "Priya Patel", phone: "+91 9123456789", line1: "15, Linking Road, Bandra West", city: "Mumbai", state: "Maharashtra", pin: "400050", country: "India" }),
        status_history: JSON.stringify([
          { status: "pending", date: daysAgo(25), completed: true },
          { status: "paid", date: daysAgo(25), completed: true },
          { status: "cancelled", date: daysAgo(24), completed: true },
        ]),
        created_at: daysAgo(25),
      },
    ];

    const { error: ordErr } = await supabaseAdmin.from("orders").insert(orders);
    results.push(ordErr ? `Orders error: ${ordErr.message}` : `${orders.length} orders inserted`);

    // ── 6. Newsletter subscribers ─────────────────────────────────
    const newsletter = [
      { email: "rahul.sharma@gmail.com" },
      { email: "priya.patel@outlook.com" },
      { email: "tech.enthusiast@yahoo.com" },
      { email: "fashion.lover@gmail.com" },
      { email: "bookworm.india@gmail.com" },
    ];

    const { error: newsErr } = await supabaseAdmin.from("newsletter").insert(newsletter);
    results.push(newsErr ? `Newsletter error: ${newsErr.message}` : `${newsletter.length} newsletter subscribers inserted`);

    // ── 7. Update product ratings from reviews ────────────────────
    // Get aggregated ratings
    const { data: ratingData } = await supabaseAdmin
      .from("reviews")
      .select("product_id, rating");

    if (ratingData) {
      const ratingMap: Record<string, { sum: number; count: number }> = {};
      for (const r of ratingData) {
        if (!ratingMap[r.product_id]) ratingMap[r.product_id] = { sum: 0, count: 0 };
        ratingMap[r.product_id].sum += r.rating;
        ratingMap[r.product_id].count += 1;
      }

      for (const [productId, { sum, count }] of Object.entries(ratingMap)) {
        await supabaseAdmin
          .from("products")
          .update({
            rating_average: Math.round((sum / count) * 10) / 10,
            rating_count: count,
          })
          .eq("id", productId);
      }
      results.push("Product ratings updated from reviews");
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
