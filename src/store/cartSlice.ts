import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';
import { RootState } from './index';

interface CartState {
  items: CartItem[];
}

const stored = localStorage.getItem('shopflow_cart');
const initialState: CartState = {
  items: stored ? JSON.parse(stored) : [],
};

const persist = (items: CartItem[]) => localStorage.setItem('shopflow_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.productId === action.payload.productId && i.variantSku === action.payload.variantSku);
      if (existing) {
        existing.qty = Math.min(existing.qty + action.payload.qty, existing.stock);
      } else {
        state.items.push(action.payload);
      }
      persist(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.variantSku !== action.payload);
      persist(state.items);
    },
    updateQty: (state, action: PayloadAction<{ variantSku: string; qty: number }>) => {
      const item = state.items.find(i => i.variantSku === action.payload.variantSku);
      if (item) {
        item.qty = Math.max(1, Math.min(action.payload.qty, item.stock));
      }
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal = (s: RootState) => s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export default cartSlice.reducer;
