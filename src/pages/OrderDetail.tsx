import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { OrderStatus } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';

const statusSteps: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
const statusLabels: Record<OrderStatus, string> = { pending: 'Placed', paid: 'Paid', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => api.getOrder(id!) });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="container mx-auto px-4 py-8 flex-1"><Skeleton className="h-96" /></div><Footer /></div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center text-muted-foreground">Order not found.</div><Footer /></div>
  );

  const cancellable = ['pending', 'paid'].includes(order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Orders', href: '/account/orders' }, { label: order.orderNumber }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
          {cancellable && <Button variant="destructive" size="sm">Cancel Order</Button>}
        </div>

        {/* Timeline */}
        {order.status !== 'cancelled' && (
          <div className="flex items-center justify-between mb-10 px-4">
            {statusSteps.map((s, i) => {
              const event = order.timeline.find(t => t.status === s);
              const completed = event?.completed;
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {completed ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 ${completed ? 'font-medium' : 'text-muted-foreground'}`}>{statusLabels[s]}</span>
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${completed ? 'bg-success' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Items */}
        <div className="border border-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" loading="lazy" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}/{item.color} × {item.qty}</p>
                </div>
                <p className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses + Payment */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border border-border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.name}<br />{order.shippingAddress.line1}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pin}<br />{order.shippingAddress.country}<br />Ph: {order.shippingAddress.phone}</p>
          </div>
          <div className="border border-border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{order.tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>₹{order.total.toLocaleString()}</span></div>
            </div>
            {order.trackingNumber && <p className="text-sm mt-4">Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span></p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
