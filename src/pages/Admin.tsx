import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Package, ShoppingBag, Warehouse, Star, Settings, Menu, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import { api } from '@/services/api';
import { products } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', path: '/admin/orders', icon: Package },
  { label: 'Inventory', path: '/admin/inventory', icon: Warehouse },
];

const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? '' : 'hidden lg:flex'} flex-col gap-1 w-56 p-4`}>
      {navItems.map(item => (
        <Link key={item.path} to={item.path} onClick={() => mobile && setMobileNavOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentPath === item.path ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}>
          <item.icon className="h-4 w-4" /> {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex border-r border-border bg-card">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          {/* Mobile nav */}
          <div className="lg:hidden mb-4">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm"><Menu className="h-4 w-4 mr-1" /> Menu</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="px-4 pt-4">Admin</SheetTitle>
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
          </div>

          {currentPath === '/admin' && <DashboardView />}
          {currentPath === '/admin/products' && <ProductsView />}
          {currentPath === '/admin/orders' && <OrdersView />}
          {currentPath === '/admin/inventory' && <InventoryView />}
        </main>
      </div>
    </div>
  );
};

const DashboardView = () => {
  const { data: stats, isLoading } = useQuery({ queryKey: ['adminStats'], queryFn: api.getAdminStats });

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>;

  const kpis = [
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-success' },
    { label: 'Orders Today', value: stats?.ordersToday, icon: Package, color: 'text-primary' },
    { label: 'New Users', value: stats?.newUsers, icon: Users, color: 'text-secondary' },
    { label: 'Pending Orders', value: stats?.pendingOrders, icon: Clock, color: 'text-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold mt-1">{k.value}</p>
                </div>
                <k.icon className={`h-8 w-8 ${k.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <Card className="mb-8">
        <CardHeader><CardTitle className="text-lg">Revenue (Last 30 Days)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-40">
            {stats?.revenueData.map((d, i) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors" style={{ height: `${(d.revenue / 20000) * 100}%` }} title={`${d.date}: ₹${d.revenue}`} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top products */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Top Products</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}</span>
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.soldCount} sold</p>
                </div>
                <span className="text-sm font-semibold">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProductsView = () => {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild><Link to="/admin/products/new">Add Product</Link></Button>
      </div>
      <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-sm px-3 py-2 text-sm border border-input rounded-md bg-background mb-4 focus:outline-none focus:ring-2 focus:ring-ring" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 px-2">Image</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2 hidden md:table-cell">SKU</th>
              <th className="py-3 px-2 hidden lg:table-cell">Category</th>
              <th className="py-3 px-2">Price</th>
              <th className="py-3 px-2 hidden md:table-cell">Stock</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map(p => (
              <tr key={p.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-2 px-2"><img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" loading="lazy" /></td>
                <td className="py-2 px-2 font-medium">{p.name}</td>
                <td className="py-2 px-2 hidden md:table-cell text-muted-foreground">{p.sku}</td>
                <td className="py-2 px-2 hidden lg:table-cell text-muted-foreground">{p.category}</td>
                <td className="py-2 px-2">₹{p.price.toLocaleString()}</td>
                <td className="py-2 px-2 hidden md:table-cell">{p.stock <= 5 ? <span className="text-destructive">{p.stock}</span> : p.stock}</td>
                <td className="py-2 px-2">
                  <Button variant="ghost" size="sm" asChild><Link to={`/admin/products/${p.id}/edit`}>Edit</Link></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrdersView = () => {
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: api.getOrders });
  const statusColors: Record<string, string> = {
    pending: 'bg-secondary/20 text-secondary',
    paid: 'bg-primary/20 text-primary',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-success/20 text-success',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 px-2">Order #</th>
              <th className="py-3 px-2 hidden md:table-cell">Date</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Total</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-2 px-2 font-mono text-xs">{o.orderNumber}</td>
                <td className="py-2 px-2 hidden md:table-cell text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-2"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[o.status]}`}>{o.status}</span></td>
                <td className="py-2 px-2 font-semibold">₹{o.total.toLocaleString()}</td>
                <td className="py-2 px-2"><Button variant="ghost" size="sm" asChild><Link to={`/account/orders/${o.id}`}>View</Link></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryView = () => {
  const lowStock = products.filter(p => p.stock <= 5);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      {lowStock.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm"><strong>{lowStock.length} products</strong> with low stock (≤ 5 units)</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 px-2">Product</th>
              <th className="py-3 px-2">SKU</th>
              <th className="py-3 px-2">Stock</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-2 px-2 flex items-center gap-2">
                  <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" loading="lazy" />
                  <span className="font-medium line-clamp-1">{p.name}</span>
                </td>
                <td className="py-2 px-2 text-muted-foreground">{p.sku}</td>
                <td className="py-2 px-2 font-semibold">{p.stock}</td>
                <td className="py-2 px-2">
                  {p.stock === 0 ? <span className="text-xs text-destructive font-medium">Out of Stock</span>
                    : p.stock <= 5 ? <span className="text-xs text-secondary font-medium">Low Stock</span>
                    : <span className="text-xs text-success font-medium">In Stock</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
