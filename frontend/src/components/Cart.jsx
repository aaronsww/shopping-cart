import React from "react";
import { useState, useEffect, useCallback } from "react";
import CartProduct from "./CartProduct";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  clearCart,
  notifyCartUpdated,
} from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCart(res.data);
      notifyCartUpdated();
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function handleRemove(productId) {
    try {
      await removeFromCart(productId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  }

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      await loadCart();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  }

  async function handleClearCart() {
    try {
      await clearCart();
      await loadCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-thin mb-8">Your Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-slate-500 text-sm">Your cart is empty.</p>
      ) : (
        <>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            {cart.items.map((item) => (
              <CartProduct
                key={item.productId}
                item={item}
                onRemove={() => handleRemove(item.productId)}
                onAdd={() => handleAdd(item.productId)}
              />
            ))}
          </div>

          <div className="mt-6 border border-slate-200 rounded-xl bg-slate-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-xl font-bold">${cart.total}</span>
            </div>
            <div className="flex gap-3">
              <button
                className="text-sm font-semibold bg-white border border-slate-200 px-5 py-2 rounded-lg hover:bg-slate-100"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button className="flex-1 text-lg font-bold bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
