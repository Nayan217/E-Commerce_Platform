import { supabase } from '@/integrations/supabase/client';

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  brand: string | null;
  price: number;
  compare_at_price: number | null;
  images: { url: string; alt: string }[];
  variants: { sku: string; size: string; color: string; colorHex: string; stock: number; price: number }[];
  total_stock: number;
  rating_average: number;
  rating_count: number;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string; slug: string; icon: string | null } | null;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
}

export interface ProductFilters {
  category?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: SupabaseProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export const supabaseApi = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug, icon)', { count: 'exact' })
      .eq('is_active', true);

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
    }
    if (filters.brand?.length) {
      query = query.in('brand', filters.brand);
    }
    if (filters.minPrice != null) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice);
    if (filters.minRating != null) query = query.gte('rating_average', filters.minRating);
    if (filters.inStock) query = query.gt('total_stock', 0);

    if (filters.category?.length) {
      // Get category IDs first
      const { data: cats } = await supabase
        .from('categories')
        .select('id')
        .in('name', filters.category);
      if (cats?.length) {
        query = query.in('category_id', cats.map(c => c.id));
      }
    }

    switch (filters.sort) {
      case 'price-asc': query = query.order('price', { ascending: true }); break;
      case 'price-desc': query = query.order('price', { ascending: false }); break;
      case 'rating': query = query.order('rating_average', { ascending: false }); break;
      case 'popular': query = query.order('rating_count', { ascending: false }); break;
      default: query = query.order('created_at', { ascending: false }); break;
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      products: (data || []) as unknown as SupabaseProduct[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  async getProduct(slug: string): Promise<SupabaseProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug, icon)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (error) return null;
    return data as unknown as SupabaseProduct;
  },

  async getCategories(): Promise<SupabaseCategory[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async getFeaturedProducts(): Promise<SupabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug, icon)')
      .eq('is_active', true)
      .order('rating_average', { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data || []) as unknown as SupabaseProduct[];
  },

  async getRelatedProducts(categoryId: string, excludeId: string): Promise<SupabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug, icon)')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .eq('is_active', true)
      .limit(4);
    if (error) throw error;
    return (data || []) as unknown as SupabaseProduct[];
  },

  async searchProducts(query: string): Promise<SupabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug, icon)')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(5);
    if (error) throw error;
    return (data || []) as unknown as SupabaseProduct[];
  },

  async getBrands(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('is_active', true);
    if (error) throw error;
    return [...new Set((data || []).map(p => p.brand).filter(Boolean))] as string[];
  },

  async getReviews(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async submitReview(productId: string, userId: string, rating: number, title: string, body: string) {
    const { error } = await supabase
      .from('reviews')
      .insert({ product_id: productId, user_id: userId, rating, title, body });
    if (error) throw error;
  },

  // Orders
  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (error) return null;
    return data;
  },

  async cancelOrder(orderId: string, userId: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  // Cart sync
  async syncCart(userId: string, items: unknown[]) {
    const { error } = await supabase
      .from('carts')
      .upsert({ user_id: userId, items: items as any, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async getCart(userId: string) {
    const { data } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', userId)
      .single();
    return data?.items || [];
  },

  // Wishlist
  async getWishlist(userId: string) {
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(w => w.product_id);
  },

  async toggleWishlist(userId: string, productId: string) {
    // Check if exists
    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (data) {
      await supabase.from('wishlists').delete().eq('id', data.id);
      return false;
    } else {
      await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
      return true;
    }
  },

  // Newsletter
  async subscribeNewsletter(email: string) {
    const { error } = await supabase.from('newsletter').insert({ email });
    if (error && error.code === '23505') throw new Error('Already subscribed');
    if (error) throw error;
  },

  // Admin
  async getAdminStats() {
    const { data: orders } = await supabase.from('orders').select('total, status, created_at');
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    const allOrders = orders || [];
    const totalRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
    const today = new Date().toISOString().split('T')[0];
    const ordersToday = allOrders.filter(o => o.created_at.startsWith(today)).length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;

    return {
      totalRevenue,
      ordersToday,
      newUsers: userCount || 0,
      pendingOrders,
    };
  },

  async getAdminProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as (SupabaseProduct & { categories: { name: string } | null })[];
  },

  async getAdminOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },

  async getActiveCoupons() {
    const { data, error } = await supabase
      .from('coupons')
      .select('code, discount_type, discount_value, min_order_amount')
      .eq('is_active', true);
    if (error) throw error;
    return data || [];
  },
};
