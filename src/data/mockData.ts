import { Product, Category, Order, Review } from '@/types';

const brands = ['TechPro', 'StyleMax', 'BookHaven', 'HomeEssentials', 'SportElite', 'GlowUp', 'NexGen', 'PrimeChoice'];
const sizes = ['S', 'M', 'L', 'XL'];
const colors = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Red', hex: '#dc2626' },
];

const generateReviews = (count: number): Review[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `review-${i}`,
    userName: ['Aarav S.', 'Priya M.', 'Rohan K.', 'Sneha D.', 'Vikram P.', 'Ananya R.', 'Karthik L.', 'Meera T.'][i % 8],
    rating: Math.floor(Math.random() * 2) + 4,
    comment: [
      'Excellent quality! Exactly as described. Would buy again.',
      'Great value for the price. Fast shipping too.',
      'Very happy with this purchase. Highly recommended!',
      'Good product but packaging could be better.',
      'Amazing! Exceeded my expectations completely.',
      'Decent product. Works as advertised.',
      'Love it! Perfect fit and great quality.',
      'Solid build quality. Worth every rupee.',
    ][i % 8],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    verified: Math.random() > 0.3,
  }));

const categoryNames = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'];
const categoryIcons = ['Smartphone', 'Shirt', 'BookOpen', 'Home', 'Dumbbell', 'Sparkles'];

export const categories: Category[] = categoryNames.map((name, i) => ({
  id: `cat-${i}`,
  name,
  slug: name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-'),
  icon: categoryIcons[i],
  productCount: 8,
}));

const productTemplates: { name: string; category: string; basePrice: number; desc: string }[] = [
  // Electronics - 8
  { name: 'Wireless Bluetooth Headphones', category: 'Electronics', basePrice: 2999, desc: 'Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio.' },
  { name: 'Smart Watch Pro', category: 'Electronics', basePrice: 4999, desc: 'Advanced fitness tracker with AMOLED display, heart rate monitor, and GPS.' },
  { name: 'Portable Power Bank 20000mAh', category: 'Electronics', basePrice: 1499, desc: 'Fast-charging power bank with dual USB-C ports and LED indicator.' },
  { name: 'Wireless Charging Pad', category: 'Electronics', basePrice: 999, desc: 'Qi-compatible wireless charger with 15W fast charging support.' },
  { name: 'Bluetooth Speaker', category: 'Electronics', basePrice: 3499, desc: 'Waterproof portable speaker with 360-degree surround sound.' },
  { name: 'USB-C Hub Adapter', category: 'Electronics', basePrice: 1999, desc: '7-in-1 hub with HDMI, USB 3.0, SD card reader, and PD charging.' },
  { name: 'Noise Cancelling Earbuds', category: 'Electronics', basePrice: 5999, desc: 'True wireless earbuds with ANC, transparency mode, and 8-hour playtime.' },
  { name: 'Mechanical Keyboard RGB', category: 'Electronics', basePrice: 3999, desc: 'Hot-swappable mechanical keyboard with per-key RGB and PBT keycaps.' },
  // Clothing - 8
  { name: 'Premium Cotton T-Shirt', category: 'Clothing', basePrice: 799, desc: 'Ultra-soft 100% organic cotton tee with a modern fit.' },
  { name: 'Slim Fit Denim Jeans', category: 'Clothing', basePrice: 2499, desc: 'Stretch denim jeans with a comfortable slim fit and premium finish.' },
  { name: 'Casual Linen Shirt', category: 'Clothing', basePrice: 1499, desc: 'Breathable linen shirt perfect for summer, with a relaxed fit.' },
  { name: 'Winter Puffer Jacket', category: 'Clothing', basePrice: 4999, desc: 'Insulated puffer jacket with water-resistant outer shell and warm lining.' },
  { name: 'Classic Hoodie', category: 'Clothing', basePrice: 1799, desc: 'Heavyweight fleece hoodie with kangaroo pocket and adjustable drawstrings.' },
  { name: 'Formal Blazer', category: 'Clothing', basePrice: 5999, desc: 'Tailored blazer in premium wool blend, perfect for office or events.' },
  { name: 'Athletic Shorts', category: 'Clothing', basePrice: 899, desc: 'Quick-dry athletic shorts with side pockets and elastic waistband.' },
  { name: 'Wool Sweater', category: 'Clothing', basePrice: 2999, desc: 'Merino wool crew neck sweater, soft and temperature-regulating.' },
  // Books - 8
  { name: 'The Art of Programming', category: 'Books', basePrice: 599, desc: 'A comprehensive guide to modern software development practices.' },
  { name: 'Mindful Living', category: 'Books', basePrice: 449, desc: 'Transform your daily routine with proven mindfulness techniques.' },
  { name: 'Business Strategy 101', category: 'Books', basePrice: 699, desc: 'Essential strategies for building and scaling successful businesses.' },
  { name: 'Creative Design Handbook', category: 'Books', basePrice: 899, desc: 'Master the principles of visual design with practical exercises.' },
  { name: 'Cooking Masterclass', category: 'Books', basePrice: 549, desc: 'Over 200 recipes from beginner basics to advanced techniques.' },
  { name: 'World History Encyclopedia', category: 'Books', basePrice: 1299, desc: 'An illustrated journey through the most pivotal moments in history.' },
  { name: 'Science Fiction Anthology', category: 'Books', basePrice: 399, desc: 'A curated collection of the best sci-fi short stories of the decade.' },
  { name: 'Photography Essentials', category: 'Books', basePrice: 799, desc: 'Learn composition, lighting, and editing from professional photographers.' },
  // Home & Garden - 8
  { name: 'Ceramic Plant Pot Set', category: 'Home & Garden', basePrice: 1299, desc: 'Set of 3 minimalist ceramic pots with drainage holes and bamboo trays.' },
  { name: 'LED Desk Lamp', category: 'Home & Garden', basePrice: 1999, desc: 'Adjustable desk lamp with 5 brightness levels and USB charging port.' },
  { name: 'Organic Cotton Bedsheet', category: 'Home & Garden', basePrice: 2499, desc: '400 thread count organic cotton sheets, luxuriously soft.' },
  { name: 'Scented Candle Collection', category: 'Home & Garden', basePrice: 899, desc: 'Hand-poured soy wax candles in 3 calming fragrances.' },
  { name: 'Wall Art Canvas Print', category: 'Home & Garden', basePrice: 1599, desc: 'Gallery-quality canvas print with fade-resistant inks.' },
  { name: 'Kitchen Utensil Set', category: 'Home & Garden', basePrice: 1099, desc: 'Premium silicone cooking utensils, heat-resistant and non-stick.' },
  { name: 'Throw Blanket', category: 'Home & Garden', basePrice: 1799, desc: 'Ultra-plush microfiber throw blanket in trendy neutral tones.' },
  { name: 'Indoor Herb Garden Kit', category: 'Home & Garden', basePrice: 699, desc: 'Complete kit with seeds, soil, and self-watering pot for fresh herbs.' },
  // Sports - 8
  { name: 'Yoga Mat Premium', category: 'Sports', basePrice: 1499, desc: 'Extra-thick non-slip yoga mat with alignment lines and carry strap.' },
  { name: 'Resistance Bands Set', category: 'Sports', basePrice: 799, desc: '5-level resistance bands with door anchor and carrying bag.' },
  { name: 'Running Shoes', category: 'Sports', basePrice: 3999, desc: 'Lightweight running shoes with responsive cushioning and breathable mesh.' },
  { name: 'Gym Duffel Bag', category: 'Sports', basePrice: 1299, desc: 'Water-resistant gym bag with shoe compartment and wet pocket.' },
  { name: 'Stainless Steel Water Bottle', category: 'Sports', basePrice: 599, desc: 'Double-wall insulated bottle, keeps drinks cold 24h or hot 12h.' },
  { name: 'Fitness Tracker Band', category: 'Sports', basePrice: 2499, desc: 'Slim fitness band with sleep tracking, step counter, and notifications.' },
  { name: 'Jump Rope Pro', category: 'Sports', basePrice: 449, desc: 'Weighted speed rope with ball bearings and adjustable length.' },
  { name: 'Foam Roller', category: 'Sports', basePrice: 899, desc: 'High-density foam roller for muscle recovery and deep tissue massage.' },
  // Beauty - 8
  { name: 'Vitamin C Serum', category: 'Beauty', basePrice: 899, desc: '20% Vitamin C serum with hyaluronic acid for brighter, firmer skin.' },
  { name: 'Moisturizing Face Cream', category: 'Beauty', basePrice: 699, desc: 'Lightweight daily moisturizer with SPF 30 and niacinamide.' },
  { name: 'Hair Care Gift Set', category: 'Beauty', basePrice: 1499, desc: 'Shampoo, conditioner, and hair mask with argan oil and keratin.' },
  { name: 'Makeup Brush Set', category: 'Beauty', basePrice: 1199, desc: '12-piece professional brush set with vegan bristles and leather case.' },
  { name: 'Natural Lip Balm Pack', category: 'Beauty', basePrice: 349, desc: 'Organic lip balm in 4 flavors: vanilla, berry, mint, and honey.' },
  { name: 'Sheet Mask Variety Pack', category: 'Beauty', basePrice: 499, desc: '10 Korean sheet masks for hydration, brightening, and anti-aging.' },
  { name: 'Perfume Eau de Parfum', category: 'Beauty', basePrice: 2999, desc: 'Long-lasting fragrance with notes of jasmine, sandalwood, and amber.' },
  { name: 'Sunscreen SPF 50', category: 'Beauty', basePrice: 549, desc: 'Lightweight, non-greasy sunscreen with broad spectrum UVA/UVB protection.' },
];

export const products: Product[] = productTemplates.map((t, i) => {
  const price = t.basePrice;
  const comparePrice = Math.round(price * 1.3);
  const imgBase = (i * 10 + 100);
  return {
    id: `prod-${i}`,
    slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    name: t.name,
    brand: brands[i % brands.length],
    sku: `SKU-${String(1000 + i)}`,
    category: t.category,
    description: t.desc,
    specifications: {
      'Material': ['Premium', 'Standard', 'Deluxe'][i % 3],
      'Weight': `${(Math.random() * 2 + 0.1).toFixed(1)} kg`,
      'Warranty': `${[1, 2, 3][i % 3]} Year`,
      'Origin': ['India', 'Japan', 'USA', 'Germany'][i % 4],
    },
    images: [
      `https://picsum.photos/seed/${imgBase}/600/600`,
      `https://picsum.photos/seed/${imgBase + 1}/600/600`,
      `https://picsum.photos/seed/${imgBase + 2}/600/600`,
      `https://picsum.photos/seed/${imgBase + 3}/600/600`,
    ],
    price,
    comparePrice,
    variants: sizes.slice(0, 3).flatMap((size) =>
      colors.slice(0, 3).map((color) => ({
        sku: `SKU-${1000 + i}-${size}-${color.name}`,
        size,
        color: color.name,
        colorHex: color.hex,
        stock: Math.floor(Math.random() * 20) + 1,
        price,
      }))
    ),
    stock: Math.floor(Math.random() * 50) + 1,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 200) + 10,
    reviews: generateReviews(Math.floor(Math.random() * 4) + 5),
    featured: i < 8,
    createdAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  };
});

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'SF-20250301-001',
    userId: 'user-1',
    items: [
      { productId: 'prod-0', name: 'Wireless Bluetooth Headphones', image: 'https://picsum.photos/seed/100/600/600', price: 2999, qty: 1, size: 'M', color: 'Black' },
      { productId: 'prod-8', name: 'Premium Cotton T-Shirt', image: 'https://picsum.photos/seed/180/600/600', price: 799, qty: 2, size: 'L', color: 'White' },
    ],
    subtotal: 4597,
    shipping: 0,
    tax: 827,
    total: 5424,
    status: 'delivered',
    shippingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    billingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK123456789',
    createdAt: '2025-03-01T10:30:00Z',
    estimatedDelivery: '2025-03-07T10:30:00Z',
    timeline: [
      { status: 'pending', date: '2025-03-01T10:30:00Z', completed: true },
      { status: 'paid', date: '2025-03-01T10:31:00Z', completed: true },
      { status: 'processing', date: '2025-03-02T09:00:00Z', completed: true },
      { status: 'shipped', date: '2025-03-03T14:00:00Z', completed: true },
      { status: 'delivered', date: '2025-03-06T11:00:00Z', completed: true },
    ],
  },
  {
    id: 'order-2',
    orderNumber: 'SF-20250310-002',
    userId: 'user-1',
    items: [
      { productId: 'prod-4', name: 'Bluetooth Speaker', image: 'https://picsum.photos/seed/140/600/600', price: 3499, qty: 1, size: 'M', color: 'Navy' },
    ],
    subtotal: 3499,
    shipping: 99,
    tax: 630,
    total: 4228,
    status: 'shipped',
    shippingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    billingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK987654321',
    createdAt: '2025-03-10T15:00:00Z',
    estimatedDelivery: '2025-03-15T10:00:00Z',
    timeline: [
      { status: 'pending', date: '2025-03-10T15:00:00Z', completed: true },
      { status: 'paid', date: '2025-03-10T15:01:00Z', completed: true },
      { status: 'processing', date: '2025-03-11T09:00:00Z', completed: true },
      { status: 'shipped', date: '2025-03-12T16:00:00Z', completed: true },
      { status: 'delivered', date: '', completed: false },
    ],
  },
  {
    id: 'order-3',
    orderNumber: 'SF-20250315-003',
    userId: 'user-1',
    items: [
      { productId: 'prod-32', name: 'Yoga Mat Premium', image: 'https://picsum.photos/seed/420/600/600', price: 1499, qty: 1, size: 'M', color: 'Black' },
      { productId: 'prod-36', name: 'Stainless Steel Water Bottle', image: 'https://picsum.photos/seed/460/600/600', price: 599, qty: 2, size: 'M', color: 'White' },
    ],
    subtotal: 2697,
    shipping: 0,
    tax: 485,
    total: 3182,
    status: 'processing',
    shippingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    billingAddress: { name: 'Aarav Sharma', phone: '9876543210', line1: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', pin: '400001', country: 'India' },
    paymentMethod: 'Credit Card',
    createdAt: '2025-03-15T08:00:00Z',
    estimatedDelivery: '2025-03-21T10:00:00Z',
    timeline: [
      { status: 'pending', date: '2025-03-15T08:00:00Z', completed: true },
      { status: 'paid', date: '2025-03-15T08:01:00Z', completed: true },
      { status: 'processing', date: '2025-03-16T10:00:00Z', completed: true },
      { status: 'shipped', date: '', completed: false },
      { status: 'delivered', date: '', completed: false },
    ],
  },
];
