import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const user = useAppSelector(selectUser);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Thank you{user ? `, ${user.name}` : ''}!</h1>
          <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-2">Estimated delivery: 5–7 business days</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/account/orders"><Package className="h-4 w-4 mr-1" /> Track Order</Link>
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
