import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabaseApi } from '@/services/supabase-api';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Headphones } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-secondary/20 text-secondary',
  paid: 'bg-primary/20 text-primary',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  shipped: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  delivered: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
};

const Orders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => supabaseApi.getOrders(user!.id),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/support"><Headphones className="h-4 w-4 mr-1" /> Need Help?</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
        ) : !orders?.length ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button asChild><Link to="/products">Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-border rounded-lg bg-card p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString()} · {(order.items as any[])?.length || 0} item(s)</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                    <span className="font-semibold">₹{Number(order.total).toLocaleString()}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/account/orders/${order.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
