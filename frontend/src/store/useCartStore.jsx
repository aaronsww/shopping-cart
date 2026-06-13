import { create } from "zustand";
import React from "react";

const useCartStore = create((set) => ({
  products: [],
  setProducts: (newData) =>
    set((state) => ({
      products: newData,
    })),
  cart: [],
  setCart: (newData) =>
    set((state) => ({
      cart: newData,
    })),
  price: 0,
  increasePrice: (addedPrice) =>
    // set((state) => ({ price: state.price + addedPrice })),
    set((state) => ({
      price: parseFloat((state.price + addedPrice).toFixed(2)),
    })),

  decreasePrice: (addedPrice) =>
    // set((state) => ({ price: state.price - addedPrice })),
    set((state) => ({
      price: parseFloat((state.price - addedPrice).toFixed(2)),
    })),

}));

export default useCartStore;
