import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Minus, Plus, Heart, ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import { api } from '@/services/api';
import { useAppDispatch } from '@/store';
import { addItem } from '@/store/cartSlice';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({ queryKey: ['product', slug], queryFn: () => api.getProduct(slug!), staleTime: 5 * 60 * 1000 });
  const { data: related, isLoading: relLoading } = useQuery({
    queryKey: ['related', product?.category, product?.id],
    queryFn: () => api.getRelatedProducts(product!.category, product!.id),
    enabled: !!product,
    staleTime: 5 * 60 * 1000,
  });

  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const sizes = product ? [...new Set(product.variants.map(v => v.size))] : [];
  const colors = product ? [...new Map(product.variants.map(v => [v.color, v])).values()] : [];
  const currentVariant = product?.variants.find(v => v.size === (selectedSize || sizes[0]) && v.color === (selectedColor || colors[0]?.color));

  const handleAdd = useCallback(() => {
    if (!product || !currentVariant) return;
    dispatch(addItem({
      productId: product.id,
      variantSku: currentVariant.sku,
      name: product.name,
      image: product.images[0],
      price: product.price,
      qty,
      stock: currentVariant.stock,
      size: currentVariant.size,
      color: currentVariant.color,
    }));
    toast({ title: 'Added to cart ✓', description: `${product.name} (${currentVariant.size}/${currentVariant.color})` });
  }, [product, currentVariant, qty, dispatch, toast]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-40" /><Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Product not found.</p></div>
      <Footer />
    </div>
  );

  const stockStatus = currentVariant ? (currentVariant.stock > 5 ? 'in-stock' : currentVariant.stock > 0 ? 'low-stock' : 'out-of-stock') : 'out-of-stock';
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: product.reviews.filter(rev => rev.rating === r).length }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Breadcrumbs items={[{ label: 'Products', href: '/products' }, { label: product.name }]} />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
              <img src={product.images[mainImg]} alt={product.name} className="h-full w-full object-cover" width={600} height={600} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setMainImg(i)} className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${mainImg === i ? 'border-primary' : 'border-transparent hover:border-border'}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" width={150} height={150} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground">{product.brand} · {product.sku}</p>
            <h1 className="text-2xl lg:text-3xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-secondary text-secondary' : 'text-muted'}`} />)}</div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.comparePrice.toLocaleString()}</span>
              <span className="text-sm text-success font-semibold">{Math.round((1 - product.price / product.comparePrice) * 100)}% off</span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {stockStatus === 'in-stock' && <span className="inline-flex items-center gap-1 text-sm text-success font-medium"><Check className="h-4 w-4" /> In Stock</span>}
              {stockStatus === 'low-stock' && <span className="inline-flex items-center gap-1 text-sm text-secondary font-medium"><AlertTriangle className="h-4 w-4" /> Low Stock — Only {currentVariant?.stock} left</span>}
              {stockStatus === 'out-of-stock' && <span className="text-sm text-destructive font-medium">Out of Stock</span>}
            </div>

            {/* Size */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Size</h3>
              <div className="flex gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`h-10 min-w-[40px] px-3 rounded-md border text-sm font-medium transition-all ${(selectedSize || sizes[0]) === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Color</h3>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c.color} onClick={() => setSelectedColor(c.color)} className={`h-8 w-8 rounded-full border-2 transition-all ${(selectedColor || colors[0]?.color) === c.color ? 'border-primary scale-110' : 'border-border'}`} style={{ backgroundColor: c.colorHex }} title={c.color} />
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-accent transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(currentVariant?.stock || 1, qty + 1))} className="h-10 w-10 flex items-center justify-center hover:bg-accent transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button className="w-full h-12 text-base" onClick={handleAdd} disabled={stockStatus === 'out-of-stock'}>
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setWishlisted(!wishlisted)}>
                <Heart className={`h-4 w-4 mr-2 ${wishlisted ? 'fill-destructive text-destructive' : ''}`} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="max-w-md space-y-2">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {/* Rating breakdown */}
            <div className="grid md:grid-cols-[240px_1fr] gap-8 mb-8">
              <div>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold">{product.rating}</span>
                  <div className="flex justify-center mt-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-secondary text-secondary' : 'text-muted'}`} />)}</div>
                  <p className="text-sm text-muted-foreground mt-1">{product.reviews.length} reviews</p>
                </div>
                {ratingDist.map(d => (
                  <div key={d.rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{d.rating}</span>
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${product.reviews.length ? (d.count / product.reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="w-4 text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {product.reviews.map(r => (
                  <div key={r.id} className="border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.userName}</span>
                      {r.verified && <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Verified</span>}
                    </div>
                    <div className="flex mt-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-secondary text-secondary' : 'text-muted'}`} />)}</div>
                    <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Write review */}
            <div className="border border-border rounded-lg p-6 max-w-md">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <Textarea placeholder="Share your experience..." className="mb-3" />
              <Button size="sm">Submit Review</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : related?.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
