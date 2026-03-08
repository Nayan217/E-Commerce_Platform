import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-card border-t border-border mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
            <ShoppingCart className="h-6 w-6" /> ShopFlow
          </Link>
          <p className="text-sm text-muted-foreground">Your one-stop shop for everything you need. Quality products, fast delivery, and excellent customer service.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-foreground transition-colors">All Products</Link>
            <Link to="/products?category=Electronics" className="hover:text-foreground transition-colors">Electronics</Link>
            <Link to="/products?category=Clothing" className="hover:text-foreground transition-colors">Clothing</Link>
            <Link to="/products?category=Books" className="hover:text-foreground transition-colors">Books</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            <Link to="/account/orders" className="hover:text-foreground transition-colors">My Orders</Link>
            <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>help@shopflow.com</span>
            <span>+91 98765 43210</span>
            <span>Mon–Sat, 9am–6pm IST</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopFlow. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
