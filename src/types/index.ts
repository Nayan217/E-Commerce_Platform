export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  price: number;
  comparePrice: number;
  variants: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  featured: boolean;
  createdAt: string;
}

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: string;
  variantSku: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  stock: number;
  size: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEvent[];
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  color: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  date: string;
  completed: boolean;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}
