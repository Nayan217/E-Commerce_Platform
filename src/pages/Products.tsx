import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, SlidersHorizontal } from 'lucide-react';
import { supabaseApi, ProductFilters } from '@/services/supabase-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
  const minRating = parseInt(searchParams.get('minRating') || '0');
  const inStock = searchParams.get('inStock') === 'true';

  const filters: ProductFilters = useMemo(() => ({
    category: selectedCategories.length ? selectedCategories : undefined,
    brand: selectedBrands.length ? selectedBrands : undefined,
    sort,
    page,
    limit: 12,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 100000 ? maxPrice : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    inStock: inStock || undefined,
  }), [searchParams.toString()]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => supabaseApi.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });

  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: supabaseApi.getBrands, staleTime: 5 * 60 * 1000 });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: supabaseApi.getCategories, staleTime: 5 * 60 * 1000 });

  const updateParam = (key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    if (value !== null) {
      if (Array.isArray(value)) value.forEach(v => params.append(key, v));
      else params.set(key, value);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const toggleArrayParam = (key: string, value: string) => {
    const current = searchParams.getAll(key);
    if (current.includes(value)) updateParam(key, current.filter(v => v !== value));
    else updateParam(key, [...current, value]);
  };

  const activeFilters = [
    ...selectedCategories.map(c => ({ label: c, key: 'category', value: c })),
    ...selectedBrands.map(b => ({ label: b, key: 'brand', value: b })),
    ...(minRating > 0 ? [{ label: `${minRating}★+`, key: 'minRating', value: '' }] : []),
    ...(inStock ? [{ label: 'In Stock', key: 'inStock', value: '' }] : []),
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-sm">Category</h3>
        <div className="space-y-2">
          {(categories || []).map(c => (
            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedCategories.includes(c.name)} onCheckedChange={() => toggleArrayParam('category', c.name)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
        <Slider min={0} max={100000} step={500} value={[minPrice, maxPrice]} onValueChange={([min, max]) => {
          const params = new URLSearchParams(searchParams);
          params.set('minPrice', String(min));
          params.set('maxPrice', String(max));
          params.delete('page');
          setSearchParams(params);
        }} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹{minPrice.toLocaleString()}</span>
          <span>₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Brand</h3>
        <div className="space-y-2">
          {brands?.map(b => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => toggleArrayParam('brand', b)} />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={minRating === r} onCheckedChange={() => updateParam('minRating', minRating === r ? null : String(r))} />
              {r}★ & above
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">In Stock Only</span>
        <Switch checked={inStock} onCheckedChange={v => updateParam('inStock', v ? 'true' : null)} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Breadcrumbs items={[{ label: 'Products' }]} />

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterPanel />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-auto">
                    <SheetTitle>Filters</SheetTitle>
                    <div className="mt-6"><FilterPanel /></div>
                  </SheetContent>
                </Sheet>
                <span className="text-sm text-muted-foreground">
                  {data ? `Showing ${((page - 1) * 12) + 1}–${Math.min(page * 12, data.total)} of ${data.total} products` : ''}
                </span>
              </div>
              <Select value={sort} onValueChange={v => updateParam('sort', v)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low–High</SelectItem>
                  <SelectItem value="price-desc">Price: High–Low</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    {f.label}
                    <button onClick={() => f.value ? toggleArrayParam(f.key, f.value) : updateParam(f.key, null)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <button onClick={() => setSearchParams({})} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Clear all</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : data?.products.map(p => <ProductCard key={p.id} product={p} />)
              }
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: data.totalPages }, (_, i) => (
                  <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(i + 1));
                    setSearchParams(params);
                  }}>{i + 1}</Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
