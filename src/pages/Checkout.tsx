import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/cartSlice';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const shippingMethods = [
  { id: 'standard', label: 'Standard Delivery', price: 0, time: '5–7 business days' },
  { id: 'express', label: 'Express Delivery', price: 99, time: '2–3 business days' },
  { id: 'next-day', label: 'Next Day Delivery', price: 199, time: '1 business day' },
];

const Checkout = () => {
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const { user, profile } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  const [form, setForm] = useState({
    email: user?.email || '',
    name: profile?.full_name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
    sameAsBilling: true,
  });

  const shippingCost = shippingMethods.find(m => m.id === shippingMethod)?.price || 0;
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = useMemo(() => subtotal + shippingCost + tax, [subtotal, shippingCost, tax]);

  const handlePay = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const shippingAddress = { name: form.name, phone: form.phone, line1: form.line1, line2: form.line2, city: form.city, state: form.state, pin: form.pin, country: form.country };

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          items: items.map(i => ({ product_id: i.productId, variant_sku: i.variantSku, qty: i.qty, size: i.size, color: i.color })),
          shipping_address: shippingAddress,
          billing_address: form.sameAsBilling ? shippingAddress : shippingAddress,
          shipping_method: shippingMethod,
          notes,
          coupon_code: null,
        },
      });

      if (error) throw new Error(error.message || 'Failed to place order');
      if (data?.error) throw new Error(data.error);

      dispatch(clearCart());
      toast({ title: 'Order placed! ✓' });
      navigate(`/order-success/${data.order_id}`);
    } catch (err: any) {
      toast({ title: err.message || 'Failed to place order', variant: 'destructive' });
    }
    setProcessing(false);
  };

  const updateForm = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        <div className="flex items-center justify-center gap-4 mb-10">
          {['Contact & Shipping', 'Review Order', 'Payment'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step > i + 1 ? 'bg-success text-success-foreground' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? 'font-semibold' : 'text-muted-foreground'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="text-xl font-bold mb-4">Contact & Shipping</h2>
            <div><Label>Email</Label><Input value={form.email} onChange={e => updateForm('email', e.target.value)} type="email" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => updateForm('name', e.target.value)} required /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => updateForm('phone', e.target.value)} required /></div>
            </div>
            <div><Label>Address Line 1</Label><Input value={form.line1} onChange={e => updateForm('line1', e.target.value)} required /></div>
            <div><Label>Address Line 2</Label><Input value={form.line2} onChange={e => updateForm('line2', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input value={form.city} onChange={e => updateForm('city', e.target.value)} required /></div>
              <div><Label>State</Label><Input value={form.state} onChange={e => updateForm('state', e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>PIN Code</Label><Input value={form.pin} onChange={e => updateForm('pin', e.target.value)} required /></div>
              <div><Label>Country</Label><Input value={form.country} onChange={e => updateForm('country', e.target.value)} required /></div>
            </div>
            <Button className="w-full mt-4" onClick={() => setStep(2)} disabled={!form.email || !form.name || !form.line1 || !form.city || !form.state || !form.pin}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold">Review Order</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.variantSku} className="flex gap-3 p-3 border border-border rounded-lg">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size}/{item.color} × {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div><Label>Order Notes (optional)</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." /></div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">Shipping Method</h3>
              <div className="space-y-2">
                {shippingMethods.map(m => (
                  <label key={m.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${shippingMethod === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="accent-primary" />
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{m.price === 0 ? 'Free' : `₹${m.price}`}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold">Confirm & Place Order</h2>
            <div className="border border-border rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" /> Cash on Delivery
              </div>
              <p className="text-sm text-muted-foreground">Payment will be collected upon delivery. Online payment integration coming soon.</p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.sameAsBilling} onCheckedChange={v => updateForm('sameAsBilling', v as boolean)} />
              Billing address same as shipping
            </label>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
              <div className="flex justify-between"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={handlePay} disabled={processing} className="flex-1">
                {processing ? 'Processing...' : `Place Order — ₹${total.toLocaleString()}`}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
