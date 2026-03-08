import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/cartSlice';
import { selectUser } from '@/store/authSlice';
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
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  const [form, setForm] = useState({
    email: user?.email || '',
    name: user?.name || '',
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
    setProcessing(true);
    // Simulate payment
    await new Promise(r => setTimeout(r, 2000));
    dispatch(clearCart());
    toast({ title: 'Order placed! ✓', description: 'Thank you for your purchase.' });
    navigate('/order-success/SF-' + Date.now());
  };

  const updateForm = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        {/* Steps */}
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

        {/* Step 1: Contact & Shipping */}
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

        {/* Step 2: Review */}
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

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-bold">Payment</h2>
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" /> Credit / Debit Card
              </div>
              <div><Label>Card Number</Label><Input placeholder="4242 4242 4242 4242" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                <div><Label>CVC</Label><Input placeholder="123" /></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <img src="https://img.icons8.com/color/32/visa.png" alt="Visa" className="h-6" />
                <img src="https://img.icons8.com/color/32/mastercard.png" alt="Mastercard" className="h-6" />
                <img src="https://img.icons8.com/color/32/amex.png" alt="Amex" className="h-6" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.sameAsBilling} onCheckedChange={v => updateForm('sameAsBilling', v as boolean)} />
              Billing address same as shipping
            </label>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
              <div className="flex justify-between"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={handlePay} disabled={processing} className="flex-1">
                <Lock className="h-4 w-4 mr-1" /> {processing ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL Encrypted</span>
              <span>PCI Compliant</span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
