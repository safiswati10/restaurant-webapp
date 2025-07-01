import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Ensure the path is correct

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Add the cart slice reducer
  },
});

export default store;