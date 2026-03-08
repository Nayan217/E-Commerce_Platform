import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartItems, selectCartTotal, removeItem, updateQty, clearCart } from '@/store/cartSlice';
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

  const shipping = useMemo(() => (subtotal >= 999 ? 0 : 99), [subtotal]);
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
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
              <div key={item.variantSku} className="flex gap-4 p-4 rounded-lg border border-border bg-card">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/products`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.size} / {item.color}</p>
                    </div>
                    <p className="font-semibold text-sm">₹{(item.price * item.qty).toLocaleString()}</p>
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
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (18% GST)</span><span>₹{tax.toLocaleString()}</span></div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} className="pl-9" />
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: 'Invalid coupon code', variant: 'destructive' })}>Apply</Button>
              </div>

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
