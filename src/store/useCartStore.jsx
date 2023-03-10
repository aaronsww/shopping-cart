import { create } from "zustand";

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
    set((state) => ({ price: state.price + addedPrice })),
  decreasePrice: (addedPrice) =>
    set((state) => ({ price: state.price - addedPrice })),
}));

export default useCartStore;
