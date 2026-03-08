import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { SupabaseProduct } from '@/services/supabase-api';
import { useAppDispatch } from '@/store';
import { addItem } from '@/store/cartSlice';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: SupabaseProduct;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants[0];
    if (!variant) return;
    dispatch(addItem({
      productId: product.id,
      variantSku: variant.sku,
      name: product.name,
      image: product.images[0]?.url || '/placeholder.svg',
      price: variant.price || product.price,
      qty: 1,
      stock: variant.stock,
      size: variant.size,
      color: variant.color,
    }));
    toast({ title: 'Added to cart ✓', description: product.name });
  }, [product, dispatch, toast]);

  const isOnSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const discount = isOnSale ? Math.round((1 - product.price / product.compare_at_price!) * 100) : 0;
  const imgUrl = product.images[0]?.url || '/placeholder.svg';
  const gstPrice = Math.round(product.price * 1.18);
  const gstCompare = isOnSale ? Math.round(product.compare_at_price! * 1.18) : 0;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={imgUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width={600} height={600} />
          
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded">-{discount}%</span>
          )}
          
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center transition-all hover:bg-background">
            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </button>
          
          {/* Show on hover for desktop, always visible on touch devices */}
          <button onClick={handleAddToCart} className="absolute bottom-2 left-2 right-2 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary/90 touch-device:opacity-100 touch-device:translate-y-0">
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </div>

        <div className="p-3">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="text-sm font-medium mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs font-medium">{product.rating_average}</span>
            <span className="text-xs text-muted-foreground">({product.rating_count})</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-semibold text-sm">₹{gstPrice.toLocaleString()}</span>
            {isOnSale && <span className="text-xs text-muted-foreground line-through">₹{gstCompare.toLocaleString()}</span>}
          </div>
          <p className="text-[10px] text-muted-foreground">incl. GST</p>
          {product.total_stock <= 5 && product.total_stock > 0 && <p className="text-xs text-secondary font-medium mt-1">Only {product.total_stock} left!</p>}
          {product.total_stock === 0 && <p className="text-xs text-destructive font-medium mt-1">Out of Stock</p>}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export const ProductCardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card">
    <Skeleton className="aspect-square rounded-b-none" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export default ProductCard;
