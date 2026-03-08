import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectCartItems, selectCartTotal, removeItem, updateQty } from '@/store/cartSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const gstTotal = Math.round(subtotal * 1.18);
  const dispatch = useAppDispatch();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={onClose} asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map(item => (
                <div key={item.variantSku} className="flex gap-3 p-3 rounded-lg border border-border">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                    <p className="text-sm font-semibold mt-1">₹{Math.round(item.price * 1.18).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">incl. GST</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(updateQty({ variantSku: item.variantSku, qty: item.qty - 1 }))} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ variantSku: item.variantSku, qty: item.qty + 1 }))} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => dispatch(removeItem(item.variantSku))} className="ml-auto text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total (incl. GST)</span>
                <span>₹{gstTotal.toLocaleString()}</span>
              </div>
              <Button className="w-full" asChild onClick={onClose}>
                <Link to="/cart">View Cart</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild onClick={onClose}>
                <Link to="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
