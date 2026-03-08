import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabase-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { user, profile } = useAuth();

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => supabaseApi.getOrder(orderId!),
    enabled: !!orderId,
  });

  // Check if this is user's first order to show loyalty coupon
  const { data: allOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => supabaseApi.getOrders(user!.id),
    enabled: !!user,
  });

  const isFirstOrder = allOrders && allOrders.length <= 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Thank you{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
          <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{order?.order_number || orderId}</p>
            <p className="text-sm text-muted-foreground mt-2">Estimated delivery: 5–7 business days</p>
          </div>

          {/* Loyalty coupon for first-time buyers */}
          {isFirstOrder && (
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Loyalty Reward!</span>
              </div>
              <p className="text-sm text-muted-foreground">Enjoy <span className="font-bold text-foreground">20% off</span> on all future purchases!</p>
              <p className="font-mono font-bold text-lg text-primary mt-1">LOYAL20</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to={`/account/orders/${orderId}`}><Package className="h-4 w-4 mr-1" /> Track Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">Continue Shopping <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
