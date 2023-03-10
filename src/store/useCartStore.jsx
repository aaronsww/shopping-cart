import { create } from "zustand";

const useCartStore = create((set) => ({
  products: [],
  setProducts: (products) =>
    set((state) => ({
      ...state,
      products,
    })),
}));

export default useCartStore;
