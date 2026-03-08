import { products, categories, mockOrders } from '@/data/mockData';
import { Product, Category, Order } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => delay(300 + Math.random() * 300);

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
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const api = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    await randomDelay();
    let filtered = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (filters.category?.length) filtered = filtered.filter(p => filters.category!.includes(p.category));
    if (filters.brand?.length) filtered = filtered.filter(p => filters.brand!.includes(p.brand));
    if (filters.minPrice != null) filtered = filtered.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice != null) filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    if (filters.minRating != null) filtered = filtered.filter(p => p.rating >= filters.minRating!);
    if (filters.inStock) filtered = filtered.filter(p => p.stock > 0);

    switch (filters.sort) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;

    return {
      products: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getProduct(slug: string): Promise<Product | undefined> {
    await randomDelay();
    return products.find(p => p.slug === slug);
  },

  async getCategories(): Promise<Category[]> {
    await randomDelay();
    return categories;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await randomDelay();
    return products.filter(p => p.featured);
  },

  async getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
    await randomDelay();
    return products.filter(p => p.category === category && p.id !== excludeId).slice(0, 4);
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(200);
    const q = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 5);
  },

  async getOrders(): Promise<Order[]> {
    await randomDelay();
    return mockOrders;
  },

  async getOrder(id: string): Promise<Order | undefined> {
    await randomDelay();
    return mockOrders.find(o => o.id === id);
  },

  async getBrands(): Promise<string[]> {
    await delay(100);
    return [...new Set(products.map(p => p.brand))];
  },

  // Admin APIs
  async getAdminStats() {
    await randomDelay();
    return {
      totalRevenue: 284500,
      ordersToday: 12,
      newUsers: 34,
      pendingOrders: 5,
      revenueData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2025, 2, i + 1).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        revenue: Math.floor(Math.random() * 15000) + 5000,
      })),
      topProducts: products.slice(0, 5).map(p => ({ ...p, soldCount: Math.floor(Math.random() * 100) + 20 })),
    };
  },
};
