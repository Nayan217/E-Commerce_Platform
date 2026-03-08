import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, Copy, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartItems, selectCartTotal, removeItem, updateQty, clearCart } from '@/store/cartSlice';
import { supabaseApi } from '@/services/supabase-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState('');

  const { data: coupons } = useQuery({
    queryKey: ['active-coupons'],
    queryFn: supabaseApi.getActiveCoupons,
    staleTime: 10 * 60 * 1000,
  });

  // Prices stored are base; GST-inclusive total = base * 1.18
  const gstSubtotal = useMemo(() => Math.round(subtotal * 1.18), [subtotal]);
  const shipping = useMemo(() => (gstSubtotal >= 999 ? 0 : 99), [gstSubtotal]);
  const total = useMemo(() => gstSubtotal + shipping, [gstSubtotal, shipping]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-4">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/20" />
          <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Button asChild><Link to="/products">Continue Shopping</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.variantSku} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border bg-card">
                <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/products`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.size} / {item.color}</p>
                    </div>
                    <p className="font-semibold text-sm shrink-0">₹{Math.round(item.price * item.qty * 1.18).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-md">
                      <button onClick={() => dispatch(updateQty({ variantSku: item.variantSku, qty: item.qty - 1 }))} className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ variantSku: item.variantSku, qty: item.qty + 1 }))} className="h-8 w-8 flex items-center justify-center hover:bg-accent transition-colors"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => { dispatch(removeItem(item.variantSku)); toast({ title: 'Item removed' }); }} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal (incl. GST)</span><span>₹{gstSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span></div>
              </div>
              <p className="text-[11px] text-muted-foreground">All prices are inclusive of 18% GST</p>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} className="pl-9" />
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: 'Coupon will be applied at checkout', description: 'Proceed to checkout to use your coupon code.' })}>Apply</Button>
              </div>

              {/* Available Coupons */}
              {coupons && coupons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Ticket className="h-3 w-3" /> Available Coupons
                  </p>
                  {coupons.map((c: any) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCoupon(c.code);
                        navigator.clipboard?.writeText(c.code);
                        toast({ title: `${c.code} copied!` });
                      }}
                      className="w-full flex items-center justify-between p-2 rounded border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{c.code}</span>
                        <span className="text-muted-foreground">
                          {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                          {c.min_order_amount > 0 && ` (min ₹${c.min_order_amount})`}
                        </span>
                      </div>
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              <Button className="w-full" asChild>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
