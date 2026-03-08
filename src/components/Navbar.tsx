import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartCount } from '@/store/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '@/store/authSlice';
import { api } from '@/services/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import CartDrawer from './CartDrawer';

const Navbar = React.memo(() => {
  const cartCount = useAppSelector(selectCartCount);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await api.searchProducts(q);
      setSearchResults(results);
    }, 300);
  }, []);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background'} border-b border-border`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetTitle className="text-lg font-bold text-primary">ShopFlow</SheetTitle>
                <nav className="mt-6 flex flex-col gap-1">
                  <Link to="/" className="px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium">Home</Link>
                  <Link to="/products" className="px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium">All Products</Link>
                  {categories.map(c => (
                    <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="px-3 py-2 rounded-lg hover:bg-accent text-sm text-muted-foreground">{c}</Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
              <ShoppingCart className="h-6 w-6" />
              <span>ShopFlow</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">Home</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  Categories <ChevronDown className="h-3 w-3" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  {categories.map(c => (
                    <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="block px-4 py-2 text-sm hover:bg-accent transition-colors">{c}</Link>
                  ))}
                </div>
              </div>
              <Link to="/products" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">All Products</Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                  <Search className="h-5 w-5" />
                </Button>
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg p-3 animate-fade-in">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => handleSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-64 overflow-auto">
                        {searchResults.map(p => (
                          <Link key={p.id} to={`/products/${p.slug}`} onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchQuery(''); }} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded object-cover" loading="lazy" />
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                              <p className="text-xs text-muted-foreground">₹{p.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button variant="ghost" size="icon" asChild>
                <Link to="/products"><Heart className="h-5 w-5" /></Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">{cartCount}</span>
                )}
              </Button>

              {/* User */}
              {isAuth ? (
                <div ref={userMenuRef} className="relative">
                  <Button variant="ghost" size="icon" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"><Package className="h-4 w-4" /> Orders</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
                      )}
                      <button onClick={() => { dispatch(logout()); setUserMenuOpen(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors w-full text-left text-destructive"><LogOut className="h-4 w-4" /> Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login"><User className="h-4 w-4 mr-1" /> Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
