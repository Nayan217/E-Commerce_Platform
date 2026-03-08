import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Smartphone, Shirt, BookOpen, Home, Dumbbell, Sparkles } from 'lucide-react';
import { supabaseApi } from '@/services/supabase-api';
import { Button } from '@/components/ui/button';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Smartphone className="h-8 w-8" />,
  Clothing: <Shirt className="h-8 w-8" />,
  Books: <BookOpen className="h-8 w-8" />,
  'Home & Garden': <Home className="h-8 w-8" />,
  Sports: <Dumbbell className="h-8 w-8" />,
  Beauty: <Sparkles className="h-8 w-8" />,
};

const trustBadges = [
  { icon: <Truck className="h-8 w-8" />, title: 'Free Shipping', desc: 'On orders over ₹999' },
  { icon: <Shield className="h-8 w-8" />, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: <RotateCcw className="h-8 w-8" />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <Headphones className="h-8 w-8" />, title: '24/7 Support', desc: 'Dedicated support team' },
];

const Index = () => {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: supabaseApi.getCategories, staleTime: 5 * 60 * 1000 });
  const { data: featured, isLoading } = useQuery({ queryKey: ['featured'], queryFn: supabaseApi.getFeaturedProducts, staleTime: 5 * 60 * 1000 });
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabaseApi.subscribeNewsletter(email);
      toast({ title: 'Subscribed! 🎉' });
      setEmail('');
    } catch (err: any) {
      toast({ title: err.message || 'Failed to subscribe', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Discover Products<br />
            <span className="text-primary">You'll Love</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Shop the latest trends in electronics, fashion, home, and more. Free shipping on orders over ₹999.
          </p>
          <Button size="lg" asChild className="text-base px-8">
            <Link to="/products">Shop Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map(cat => (
            <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 group">
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {categoryIcons[cat.name] || <span className="text-3xl">{cat.icon}</span>}
              </div>
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Button variant="ghost" asChild>
            <Link to="/products">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured?.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      <section className="bg-card border-y border-border py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Shop With Us</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map(b => (
              <div key={b.title} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="text-primary">{b.icon}</div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">Subscribe for exclusive deals and new arrivals.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
