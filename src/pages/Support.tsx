import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Mail, Phone, Clock, ChevronDown, ChevronUp, Package, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  { q: 'How do I track my order?', a: 'Go to My Orders in your account and click on the order to see real-time tracking information.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all unused items in original packaging. Contact support to initiate a return.' },
  { q: 'How long does shipping take?', a: 'Standard delivery takes 5–7 business days. Express (₹99) takes 2–3 days. Next-day delivery (₹199) is also available.' },
  { q: 'Do you ship internationally?', a: 'Currently we only ship within India. International shipping is coming soon.' },
  { q: 'How do I use a coupon code?', a: 'Enter your coupon code in the cart page or during checkout. The discount will be applied automatically.' },
  { q: 'What payment methods do you accept?', a: 'We currently support Cash on Delivery (COD). Online payment options are coming soon.' },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [orderLookup, setOrderLookup] = useState('');
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <div className="text-center mb-12">
          <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">How can we help?</h1>
          <p className="text-muted-foreground">Find answers to common questions or reach out to our support team.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link to="/account/orders" className="flex flex-col items-center gap-2 p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
            <Package className="h-8 w-8 text-primary" />
            <span className="font-medium text-sm">Track My Order</span>
          </Link>
          <a href="mailto:help@shopflow.com" className="flex flex-col items-center gap-2 p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
            <Mail className="h-8 w-8 text-primary" />
            <span className="font-medium text-sm">Email Support</span>
          </a>
          <a href="tel:+919876543210" className="flex flex-col items-center gap-2 p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
            <Phone className="h-8 w-8 text-primary" />
            <span className="font-medium text-sm">Call Us</span>
          </a>
        </div>

        {/* Order Lookup */}
        <div className="border border-border rounded-lg p-6 bg-card mb-12">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Package className="h-5 w-5" /> Order Lookup</h2>
          <div className="flex gap-3">
            <Input placeholder="Enter order number (e.g. SF-20260308-XXXX)" value={orderLookup} onChange={e => setOrderLookup(e.target.value)} className="flex-1" />
            <Button onClick={() => {
              if (!orderLookup.trim()) { toast({ title: 'Please enter an order number', variant: 'destructive' }); return; }
              toast({ title: 'Please log in and check My Orders for order details.' });
            }}>Look Up</Button>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="border border-border rounded-lg p-6 bg-card mb-12">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Send us a Message</h2>
          <form onSubmit={e => { e.preventDefault(); toast({ title: 'Message sent! We\'ll get back to you within 24 hours.' }); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input required /></div>
              <div><Label>Email</Label><Input type="email" required /></div>
            </div>
            <div><Label>Subject</Label><Input required /></div>
            <div><Label>Message</Label><Textarea required rows={4} /></div>
            <Button type="submit">Send Message</Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-2"><Mail className="h-4 w-4" /> help@shopflow.com</div>
          <div className="flex items-center justify-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</div>
          <div className="flex items-center justify-center gap-2"><Clock className="h-4 w-4" /> Mon–Sat, 9am–6pm IST</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
