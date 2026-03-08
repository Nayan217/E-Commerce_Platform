
-- Seed Categories
INSERT INTO public.categories (name, slug, icon, image_url) VALUES
  ('Electronics', 'electronics', '⚡', 'https://picsum.photos/seed/electronics/400/300'),
  ('Clothing', 'clothing', '👕', 'https://picsum.photos/seed/clothing/400/300'),
  ('Books', 'books', '📚', 'https://picsum.photos/seed/books/400/300'),
  ('Home & Garden', 'home-garden', '🏡', 'https://picsum.photos/seed/home-garden/400/300'),
  ('Sports', 'sports', '🏃', 'https://picsum.photos/seed/sports/400/300'),
  ('Beauty', 'beauty', '💄', 'https://picsum.photos/seed/beauty/400/300');

-- Seed Products - Electronics (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'boAt Airdopes 141', 'boat-airdopes-141',
  'Wireless earbuds with 42H playtime, ENx Technology, IWP, BEAST Mode for gaming, IPX4 water resistance.',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'boAt', 1299, 1689,
  '[{"url":"https://picsum.photos/seed/boat-airdopes-141/800/800","alt":"boAt Airdopes 141"}]'::jsonb,
  '[{"sku":"BA141-BLK","size":"One Size","color":"Black","colorHex":"#000000","stock":25,"price":1299},{"sku":"BA141-WHT","size":"One Size","color":"White","colorHex":"#FFFFFF","stock":18,"price":1299},{"sku":"BA141-BLU","size":"One Size","color":"Blue","colorHex":"#3B82F6","stock":12,"price":1349}]'::jsonb,
  55, 4.2, 1847, ARRAY['wireless','earbuds','bluetooth']
),
(
  'Samsung Galaxy S24 FE', 'samsung-galaxy-s24-fe',
  '6.7" Dynamic AMOLED 2X, Exynos 2400e, 8GB RAM, 128GB storage, 50MP triple camera, 4700mAh battery.',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'Samsung', 49999, 64999,
  '[{"url":"https://picsum.photos/seed/samsung-s24-fe/800/800","alt":"Samsung Galaxy S24 FE"}]'::jsonb,
  '[{"sku":"S24FE-BLK-128","size":"128GB","color":"Graphite","colorHex":"#374151","stock":10,"price":49999},{"sku":"S24FE-BLU-128","size":"128GB","color":"Blue","colorHex":"#2563EB","stock":8,"price":49999},{"sku":"S24FE-GRN-256","size":"256GB","color":"Mint","colorHex":"#34D399","stock":5,"price":55999}]'::jsonb,
  23, 4.5, 632, ARRAY['smartphone','5g','samsung']
),
(
  'HP Pavilion Laptop 15', 'hp-pavilion-laptop-15',
  '15.6" FHD IPS, AMD Ryzen 5 7530U, 16GB DDR4, 512GB SSD, Windows 11 Home, Backlit Keyboard.',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'HP', 42990, 55890,
  '[{"url":"https://picsum.photos/seed/hp-pavilion-15/800/800","alt":"HP Pavilion 15"}]'::jsonb,
  '[{"sku":"HPP15-SLV","size":"16GB/512GB","color":"Silver","colorHex":"#C0C0C0","stock":7,"price":42990},{"sku":"HPP15-BLU","size":"16GB/512GB","color":"Blue","colorHex":"#1E40AF","stock":4,"price":42990},{"sku":"HPP15-SLV-1TB","size":"16GB/1TB","color":"Silver","colorHex":"#C0C0C0","stock":3,"price":48990}]'::jsonb,
  14, 4.3, 289, ARRAY['laptop','amd','windows']
),
(
  'Sony WH-1000XM5', 'sony-wh-1000xm5',
  'Industry-leading noise cancellation, 30hr battery, multipoint Bluetooth, speak-to-chat, Hi-Res Audio.',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'Sony', 24990, 32490,
  '[{"url":"https://picsum.photos/seed/sony-xm5/800/800","alt":"Sony WH-1000XM5"}]'::jsonb,
  '[{"sku":"XM5-BLK","size":"One Size","color":"Black","colorHex":"#000000","stock":15,"price":24990},{"sku":"XM5-SLV","size":"One Size","color":"Platinum Silver","colorHex":"#D1D5DB","stock":10,"price":24990},{"sku":"XM5-BLU","size":"One Size","color":"Midnight Blue","colorHex":"#1E3A5F","stock":8,"price":25990}]'::jsonb,
  33, 4.7, 1203, ARRAY['headphones','noise-cancelling','wireless']
);

-- Seed Products - Clothing (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'Allen Solly Formal Shirt', 'allen-solly-formal-shirt',
  'Premium cotton formal shirt with a slim fit. Spread collar, full sleeves, button-down front.',
  (SELECT id FROM public.categories WHERE slug = 'clothing'),
  'Allen Solly', 1499, 1949,
  '[{"url":"https://picsum.photos/seed/allen-solly-shirt/800/800","alt":"Allen Solly Formal Shirt"}]'::jsonb,
  '[{"sku":"AS-WHT-S","size":"S","color":"White","colorHex":"#FFFFFF","stock":20,"price":1499},{"sku":"AS-BLU-M","size":"M","color":"Light Blue","colorHex":"#93C5FD","stock":30,"price":1499},{"sku":"AS-BLU-L","size":"L","color":"Light Blue","colorHex":"#93C5FD","stock":15,"price":1499}]'::jsonb,
  65, 4.1, 542, ARRAY['formal','cotton','shirt']
),
(
  'Levi''s 511 Slim Fit Jeans', 'levis-511-slim-jeans',
  'Classic slim fit jeans with stretch denim. Sits below waist, slim through hip and thigh.',
  (SELECT id FROM public.categories WHERE slug = 'clothing'),
  'Levi''s', 2799, 3639,
  '[{"url":"https://picsum.photos/seed/levis-511/800/800","alt":"Levis 511 Jeans"}]'::jsonb,
  '[{"sku":"LV511-IND-30","size":"30","color":"Indigo","colorHex":"#312E81","stock":12,"price":2799},{"sku":"LV511-BLK-32","size":"32","color":"Black","colorHex":"#000000","stock":18,"price":2799},{"sku":"LV511-IND-34","size":"34","color":"Indigo","colorHex":"#312E81","stock":10,"price":2799}]'::jsonb,
  40, 4.4, 1891, ARRAY['jeans','denim','slim-fit']
),
(
  'Nike Air Max 270', 'nike-air-max-270',
  'The Nike Air Max 270 features Nike''s biggest heel Air unit yet for a super-soft ride.',
  (SELECT id FROM public.categories WHERE slug = 'clothing'),
  'Nike', 11495, 14944,
  '[{"url":"https://picsum.photos/seed/nike-airmax-270/800/800","alt":"Nike Air Max 270"}]'::jsonb,
  '[{"sku":"NAM270-BLK-8","size":"UK 8","color":"Black/White","colorHex":"#000000","stock":8,"price":11495},{"sku":"NAM270-WHT-9","size":"UK 9","color":"White/Red","colorHex":"#FFFFFF","stock":6,"price":11495},{"sku":"NAM270-BLU-10","size":"UK 10","color":"Navy","colorHex":"#1E3A5F","stock":4,"price":11995}]'::jsonb,
  18, 4.6, 734, ARRAY['sneakers','shoes','running']
),
(
  'US Polo Assn Polo T-Shirt', 'us-polo-tshirt',
  'Classic fit polo t-shirt in 100% cotton pique. Ribbed collar, two-button placket.',
  (SELECT id FROM public.categories WHERE slug = 'clothing'),
  'US Polo Assn', 899, 1169,
  '[{"url":"https://picsum.photos/seed/us-polo-tshirt/800/800","alt":"US Polo Polo T-Shirt"}]'::jsonb,
  '[{"sku":"USP-RED-M","size":"M","color":"Red","colorHex":"#EF4444","stock":25,"price":899},{"sku":"USP-NAV-L","size":"L","color":"Navy","colorHex":"#1E3A5F","stock":30,"price":899},{"sku":"USP-GRN-XL","size":"XL","color":"Green","colorHex":"#22C55E","stock":20,"price":949}]'::jsonb,
  75, 4.0, 2103, ARRAY['polo','cotton','casual']
);

-- Seed Products - Books (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'Atomic Habits by James Clear', 'atomic-habits',
  'The #1 New York Times bestseller. Tiny changes, remarkable results. An easy & proven way to build good habits.',
  (SELECT id FROM public.categories WHERE slug = 'books'),
  'Penguin', 499, 649,
  '[{"url":"https://picsum.photos/seed/atomic-habits/800/800","alt":"Atomic Habits Book"}]'::jsonb,
  '[{"sku":"AH-PB","size":"Paperback","color":"Standard","colorHex":"#F59E0B","stock":50,"price":499},{"sku":"AH-HB","size":"Hardcover","color":"Standard","colorHex":"#F59E0B","stock":20,"price":799},{"sku":"AH-KD","size":"Kindle","color":"Digital","colorHex":"#3B82F6","stock":999,"price":299}]'::jsonb,
  1069, 4.8, 5420, ARRAY['self-help','habits','bestseller']
),
(
  'The Psychology of Money', 'psychology-of-money',
  'Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories about the strange ways people think about money.',
  (SELECT id FROM public.categories WHERE slug = 'books'),
  'Jaico', 399, 519,
  '[{"url":"https://picsum.photos/seed/psychology-money/800/800","alt":"Psychology of Money"}]'::jsonb,
  '[{"sku":"POM-PB","size":"Paperback","color":"Standard","colorHex":"#10B981","stock":40,"price":399},{"sku":"POM-HB","size":"Hardcover","color":"Standard","colorHex":"#10B981","stock":15,"price":599},{"sku":"POM-KD","size":"Kindle","color":"Digital","colorHex":"#3B82F6","stock":999,"price":249}]'::jsonb,
  1054, 4.7, 3891, ARRAY['finance','money','bestseller']
),
(
  'Rich Dad Poor Dad', 'rich-dad-poor-dad',
  'What the rich teach their kids about money — that the poor and middle class do not! By Robert T. Kiyosaki.',
  (SELECT id FROM public.categories WHERE slug = 'books'),
  'Plata Publishing', 399, 519,
  '[{"url":"https://picsum.photos/seed/rich-dad/800/800","alt":"Rich Dad Poor Dad"}]'::jsonb,
  '[{"sku":"RDPD-PB","size":"Paperback","color":"Standard","colorHex":"#8B5CF6","stock":35,"price":399},{"sku":"RDPD-HB","size":"Hardcover","color":"Standard","colorHex":"#8B5CF6","stock":10,"price":649},{"sku":"RDPD-KD","size":"Kindle","color":"Digital","colorHex":"#3B82F6","stock":999,"price":199}]'::jsonb,
  1044, 4.5, 8234, ARRAY['finance','investing','classic']
),
(
  'Ikigai: The Japanese Secret', 'ikigai-japanese-secret',
  'The international bestseller revealing the secrets to a long and happy life from the people of Japan.',
  (SELECT id FROM public.categories WHERE slug = 'books'),
  'Penguin', 349, 454,
  '[{"url":"https://picsum.photos/seed/ikigai/800/800","alt":"Ikigai Book"}]'::jsonb,
  '[{"sku":"IKI-PB","size":"Paperback","color":"Standard","colorHex":"#EC4899","stock":45,"price":349},{"sku":"IKI-HB","size":"Hardcover","color":"Standard","colorHex":"#EC4899","stock":12,"price":549},{"sku":"IKI-KD","size":"Kindle","color":"Digital","colorHex":"#3B82F6","stock":999,"price":199}]'::jsonb,
  1056, 4.4, 4102, ARRAY['self-help','japanese','happiness']
);

-- Seed Products - Home & Garden (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'Philips Air Purifier AC1215', 'philips-air-purifier-ac1215',
  'True HEPA filter removes 99.97% of airborne allergens. Coverage up to 677 sq ft. VitaShield IPS technology.',
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'Philips', 8999, 11699,
  '[{"url":"https://picsum.photos/seed/philips-purifier/800/800","alt":"Philips Air Purifier"}]'::jsonb,
  '[{"sku":"PAP-WHT","size":"Standard","color":"White","colorHex":"#FFFFFF","stock":12,"price":8999},{"sku":"PAP-BLK","size":"Standard","color":"Black","colorHex":"#000000","stock":8,"price":8999},{"sku":"PAP-WHT-PRO","size":"Pro","color":"White","colorHex":"#FFFFFF","stock":5,"price":12999}]'::jsonb,
  25, 4.3, 567, ARRAY['air-purifier','hepa','home-appliance']
),
(
  'Pigeon Stovekraft Favourite Pressure Cooker', 'pigeon-pressure-cooker',
  '5 litre aluminium outer lid pressure cooker. ISI certified, induction base compatible, ergonomic handles.',
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'Pigeon', 849, 1104,
  '[{"url":"https://picsum.photos/seed/pigeon-cooker/800/800","alt":"Pigeon Pressure Cooker"}]'::jsonb,
  '[{"sku":"PPC-3L","size":"3 Litre","color":"Silver","colorHex":"#C0C0C0","stock":30,"price":649},{"sku":"PPC-5L","size":"5 Litre","color":"Silver","colorHex":"#C0C0C0","stock":25,"price":849},{"sku":"PPC-7L","size":"7 Litre","color":"Silver","colorHex":"#C0C0C0","stock":15,"price":1099}]'::jsonb,
  70, 4.1, 3421, ARRAY['kitchen','cookware','pressure-cooker']
),
(
  'Urban Ladder Maxis Floor Lamp', 'urban-ladder-floor-lamp',
  'Contemporary floor lamp with fabric shade and metal base. Warm white E27 bulb compatible. Height: 150cm.',
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'Urban Ladder', 3499, 4549,
  '[{"url":"https://picsum.photos/seed/urban-ladder-lamp/800/800","alt":"Urban Ladder Floor Lamp"}]'::jsonb,
  '[{"sku":"UL-BLK","size":"Standard","color":"Black","colorHex":"#000000","stock":10,"price":3499},{"sku":"UL-BRS","size":"Standard","color":"Brass","colorHex":"#D4A017","stock":7,"price":3799},{"sku":"UL-WHT","size":"Standard","color":"White","colorHex":"#FFFFFF","stock":5,"price":3499}]'::jsonb,
  22, 4.2, 198, ARRAY['lamp','lighting','decor']
),
(
  'Bombay Dyeing Floral Cotton Bedsheet', 'bombay-dyeing-bedsheet',
  'Premium 144 TC 100% cotton double bedsheet with 2 pillow covers. Floral print, easy wash & care.',
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'Bombay Dyeing', 799, 1039,
  '[{"url":"https://picsum.photos/seed/bombay-dyeing/800/800","alt":"Bombay Dyeing Bedsheet"}]'::jsonb,
  '[{"sku":"BD-BLU","size":"Double","color":"Blue Floral","colorHex":"#60A5FA","stock":20,"price":799},{"sku":"BD-PNK","size":"Double","color":"Pink Floral","colorHex":"#F472B6","stock":18,"price":799},{"sku":"BD-GRN","size":"King","color":"Green Floral","colorHex":"#4ADE80","stock":12,"price":999}]'::jsonb,
  50, 4.0, 2567, ARRAY['bedsheet','cotton','bedding']
);

-- Seed Products - Sports (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'Nivia Storm Football', 'nivia-storm-football',
  'Machine stitched training football. 32-panel design, rubberized moulded surface, suitable for all surfaces.',
  (SELECT id FROM public.categories WHERE slug = 'sports'),
  'Nivia', 599, 779,
  '[{"url":"https://picsum.photos/seed/nivia-football/800/800","alt":"Nivia Storm Football"}]'::jsonb,
  '[{"sku":"NSF-5","size":"Size 5","color":"White/Blue","colorHex":"#FFFFFF","stock":30,"price":599},{"sku":"NSF-4","size":"Size 4","color":"White/Blue","colorHex":"#FFFFFF","stock":20,"price":549},{"sku":"NSF-5-BLK","size":"Size 5","color":"Black/Yellow","colorHex":"#000000","stock":15,"price":649}]'::jsonb,
  65, 4.0, 1234, ARRAY['football','training','outdoor']
),
(
  'Boldfit Yoga Mat 6mm', 'boldfit-yoga-mat',
  'Extra thick 6mm NBR yoga mat with carrying strap. Anti-slip texture, moisture resistant, lightweight.',
  (SELECT id FROM public.categories WHERE slug = 'sports'),
  'Boldfit', 599, 779,
  '[{"url":"https://picsum.photos/seed/boldfit-yogamat/800/800","alt":"Boldfit Yoga Mat"}]'::jsonb,
  '[{"sku":"BYM-BLK","size":"6mm","color":"Black","colorHex":"#000000","stock":40,"price":599},{"sku":"BYM-BLU","size":"6mm","color":"Blue","colorHex":"#3B82F6","stock":35,"price":599},{"sku":"BYM-PNK","size":"6mm","color":"Pink","colorHex":"#EC4899","stock":25,"price":599}]'::jsonb,
  100, 4.3, 2891, ARRAY['yoga','fitness','mat']
),
(
  'Yonex Nanoray Light 18i Racquet', 'yonex-nanoray-18i',
  'Isometric head shape, Nanomesh + Carbon Nanotube frame, built-in T-joint. Weight: 77g (4U). For intermediate players.',
  (SELECT id FROM public.categories WHERE slug = 'sports'),
  'Yonex', 2190, 2847,
  '[{"url":"https://picsum.photos/seed/yonex-racquet/800/800","alt":"Yonex Nanoray 18i"}]'::jsonb,
  '[{"sku":"YNR-BLK","size":"G4","color":"Black/Orange","colorHex":"#000000","stock":12,"price":2190},{"sku":"YNR-BLU","size":"G4","color":"Blue/Yellow","colorHex":"#2563EB","stock":8,"price":2190},{"sku":"YNR-RED","size":"G5","color":"Red/Black","colorHex":"#DC2626","stock":6,"price":2290}]'::jsonb,
  26, 4.5, 567, ARRAY['badminton','racquet','yonex']
),
(
  'Fitbit Charge 6', 'fitbit-charge-6',
  'Advanced health & fitness tracker with built-in GPS, heart rate monitoring, stress management, 7-day battery.',
  (SELECT id FROM public.categories WHERE slug = 'sports'),
  'Fitbit', 14999, 19499,
  '[{"url":"https://picsum.photos/seed/fitbit-charge6/800/800","alt":"Fitbit Charge 6"}]'::jsonb,
  '[{"sku":"FC6-BLK","size":"S/M","color":"Black","colorHex":"#000000","stock":15,"price":14999},{"sku":"FC6-WHT","size":"S/M","color":"Porcelain","colorHex":"#F5F5DC","stock":10,"price":14999},{"sku":"FC6-BLK-LG","size":"L/XL","color":"Black","colorHex":"#000000","stock":8,"price":14999}]'::jsonb,
  33, 4.4, 891, ARRAY['fitness-tracker','gps','health']
);

-- Seed Products - Beauty (4)
INSERT INTO public.products (name, slug, description, category_id, brand, price, compare_at_price, images, variants, total_stock, rating_average, rating_count, tags) VALUES
(
  'Lakme Absolute Gel Stylist Nail Color', 'lakme-nail-color',
  'High-gloss gel finish nail polish. Chip-resistant formula, salon-like shine for up to 7 days.',
  (SELECT id FROM public.categories WHERE slug = 'beauty'),
  'Lakme', 299, 389,
  '[{"url":"https://picsum.photos/seed/lakme-nail/800/800","alt":"Lakme Nail Color"}]'::jsonb,
  '[{"sku":"LNC-RED","size":"12ml","color":"Scarlet Red","colorHex":"#DC2626","stock":40,"price":299},{"sku":"LNC-PNK","size":"12ml","color":"Pink Rose","colorHex":"#F472B6","stock":35,"price":299},{"sku":"LNC-NDE","size":"12ml","color":"Nude Blush","colorHex":"#D4A574","stock":30,"price":299}]'::jsonb,
  105, 4.1, 3456, ARRAY['nail-polish','gel','beauty']
),
(
  'Mamaearth Vitamin C Face Wash', 'mamaearth-vitamin-c-facewash',
  'Brightening face wash with vitamin C & turmeric. Paraben-free, SLS-free, suitable for all skin types.',
  (SELECT id FROM public.categories WHERE slug = 'beauty'),
  'Mamaearth', 349, 454,
  '[{"url":"https://picsum.photos/seed/mamaearth-facewash/800/800","alt":"Mamaearth Face Wash"}]'::jsonb,
  '[{"sku":"ME-100","size":"100ml","color":"Standard","colorHex":"#F59E0B","stock":50,"price":349},{"sku":"ME-150","size":"150ml","color":"Standard","colorHex":"#F59E0B","stock":30,"price":449},{"sku":"ME-250","size":"250ml","color":"Standard","colorHex":"#F59E0B","stock":20,"price":599}]'::jsonb,
  100, 4.2, 5678, ARRAY['face-wash','vitamin-c','skincare']
),
(
  'Forest Essentials Soundarya Serum', 'forest-essentials-serum',
  'Luxurious Ayurvedic beauty serum with 24K gold and pure silk proteins. Reduces fine lines, radiant glow.',
  (SELECT id FROM public.categories WHERE slug = 'beauty'),
  'Forest Essentials', 4475, 5818,
  '[{"url":"https://picsum.photos/seed/forest-essentials/800/800","alt":"Forest Essentials Serum"}]'::jsonb,
  '[{"sku":"FES-25","size":"25ml","color":"Gold","colorHex":"#D4A017","stock":8,"price":4475},{"sku":"FES-50","size":"50ml","color":"Gold","colorHex":"#D4A017","stock":5,"price":7950},{"sku":"FES-15","size":"15ml","color":"Gold","colorHex":"#D4A017","stock":12,"price":2975}]'::jsonb,
  25, 4.6, 432, ARRAY['serum','ayurvedic','luxury']
),
(
  'Maybelline Fit Me Foundation', 'maybelline-fit-me-foundation',
  'Matte + poreless liquid foundation. Oil-free, blurs pores, controls shine. Available in 18 shades.',
  (SELECT id FROM public.categories WHERE slug = 'beauty'),
  'Maybelline', 549, 714,
  '[{"url":"https://picsum.photos/seed/maybelline-fitme/800/800","alt":"Maybelline Fit Me Foundation"}]'::jsonb,
  '[{"sku":"MFM-120","size":"30ml","color":"Classic Ivory 120","colorHex":"#F5DEB3","stock":20,"price":549},{"sku":"MFM-128","size":"30ml","color":"Warm Nude 128","colorHex":"#D2B48C","stock":25,"price":549},{"sku":"MFM-230","size":"30ml","color":"Natural Buff 230","colorHex":"#C4A882","stock":15,"price":549}]'::jsonb,
  60, 4.3, 4521, ARRAY['foundation','matte','makeup']
);

-- Seed Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 500, 1000, true),
  ('FLAT200', 'fixed', 200, 1500, 500, true),
  ('SUMMER25', 'percentage', 25, 2000, 200, true);
