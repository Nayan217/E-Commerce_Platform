import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabase-api';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
const statusLabels: Record<string, string> = { pending: 'Placed', paid: 'Paid', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => supabaseApi.getOrder(id!),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="container mx-auto px-4 py-8 flex-1"><Skeleton className="h-96" /></div><Footer /></div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center text-muted-foreground">Order not found.</div><Footer /></div>
  );

  const cancellable = ['pending', 'paid'].includes(order.status);
  const currentStepIdx = statusSteps.indexOf(order.status);
  const items = (order.items as any[]) || [];
  const shipping = order.shipping_address as any;

  const handleCancel = async () => {
    try {
      await supabaseApi.cancelOrder(order.id, user!.id);
      toast({ title: 'Order cancelled' });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    } catch {
      toast({ title: 'Failed to cancel order', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Orders', href: '/account/orders' }, { label: order.order_number || '' }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{order.order_number}</h1>
            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
          {cancellable && <Button variant="destructive" size="sm" onClick={handleCancel}>Cancel Order</Button>}
        </div>

        {order.status !== 'cancelled' && (
          <div className="flex items-center justify-between mb-10 px-4">
            {statusSteps.map((s, i) => {
              const completed = i <= currentStepIdx;
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {completed ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 ${completed ? 'font-medium' : 'text-muted-foreground'}`}>{statusLabels[s]}</span>
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${completed && i < currentStepIdx ? 'bg-success' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="border border-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex gap-3 items-center">
                <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-14 h-14 rounded object-cover" loading="lazy" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}/{item.color} × {item.qty}</p>
                </div>
                <p className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {shipping && (
            <div className="border border-border rounded-lg p-6">
              <h2 className="font-semibold mb-3">Shipping Address</h2>
              <p className="text-sm text-muted-foreground">{shipping.name}<br />{shipping.line1}<br />{shipping.city}, {shipping.state} {shipping.pin}<br />{shipping.country}<br />Ph: {shipping.phone}</p>
            </div>
          )}
          <div className="border border-border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{Number(order.subtotal).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{Number(order.shipping_cost) === 0 ? 'Free' : `₹${Number(order.shipping_cost)}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{Number(order.tax).toLocaleString()}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{Number(order.discount).toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>₹{Number(order.total).toLocaleString()}</span></div>
            </div>
            {order.tracking_number && <p className="text-sm mt-4">Tracking: <span className="font-mono font-medium">{order.tracking_number}</span></p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
