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
import { checkoutPreview, checkoutConfirm } from "../services/checkoutService";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCart(res.data);
      notifyCartUpdated();
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  }, []);

  const loadPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const res = await checkoutPreview();
      setPreview(res.data);
    } catch (err) {
      setPreview(null);
      console.error("Failed to load checkout preview:", err);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (cart.items.length === 0) {
      setPreview(null);
      return;
    }

    loadPreview();
  }, [cart.items, loadPreview]);

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
      setPreview(null);
      await loadCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setCheckoutError(null);
    const appliedCode = preview?.appliedDiscountCode ?? null;

    try {
      const res = await checkoutConfirm();
      setOrderResult({ ...res.data, appliedDiscountCode: appliedCode });
      setPreview(null);
      await loadCart();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Checkout failed. Please try again.";
      setCheckoutError(message);
      console.error("Failed to checkout:", err);
    } finally {
      setLoading(false);
    }
  }

  const hasDiscount = preview && Number(preview.discountAmount) > 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-thin mb-8">Your Cart</h1>

      {cart.items.length === 0 && !orderResult ? (
        <p className="text-slate-500 text-sm">Your cart is empty.</p>
      ) : (
        <>
          {cart.items.length > 0 && (
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
          )}

          {cart.items.length > 0 && (
            <div className="mt-6 border border-slate-200 rounded-xl bg-slate-50 p-6">
              {previewLoading && !preview ? (
                <p className="text-sm text-slate-500 mb-4">Calculating total...</p>
              ) : preview ? (
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span>${preview.subtotal}</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-green-700">
                      <span>
                        Discount
                        {preview.appliedDiscountCode && (
                          <span className="text-slate-500 ml-1">
                            ({preview.appliedDiscountCode})
                          </span>
                        )}
                      </span>
                      <span>-${preview.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${preview.finalAmount}</span>
                  </div>
                </div>
              ) : null}

              {checkoutError && (
                <p className="text-sm text-red-600 mb-4">{checkoutError}</p>
              )}

              <div className="flex gap-3">
                <button
                  className="text-sm font-semibold bg-white border border-slate-200 px-5 py-2 rounded-lg hover:bg-slate-100"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Clear Cart
                </button>
                <button
                  className="flex-1 text-lg font-bold bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  onClick={handlePlaceOrder}
                  disabled={loading || previewLoading || !preview}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {orderResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-thin mb-4">Order Confirmed</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Order ID</span>
                <span className="font-semibold">{orderResult.orderId}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>${orderResult.finalAmount}</span>
              </div>
              {orderResult.appliedDiscountCode && (
                <p className="text-green-700 pt-2 border-t">
                  {orderResult.appliedDiscountCode} was applied to this order.
                </p>
              )}
            </div>
            <button
              className="mt-6 w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700"
              onClick={() => setOrderResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
