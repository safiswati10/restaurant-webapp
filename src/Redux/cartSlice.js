import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Initial state for cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity; // Update quantity if item exists
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity }); // Add new item
      }
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity; // Update quantity
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload); // Remove item
    },
    clearCart: (state) => {
      state.items = []; // Clear all items
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;