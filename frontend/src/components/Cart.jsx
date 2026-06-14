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
  const [previewError, setPreviewError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCart(res.data);
      notifyCartUpdated();
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  }, []);

  const resetDiscountPreview = useCallback(() => {
    setPreview(null);
    setAppliedCode(null);
    setPreviewError(null);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function handleRemove(productId) {
    try {
      await removeFromCart(productId);
      resetDiscountPreview();
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  }

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      resetDiscountPreview();
      await loadCart();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  }

  async function handleClearCart() {
    try {
      await clearCart();
      resetDiscountPreview();
      setDiscountInput("");
      await loadCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  async function handleApplyDiscount(e) {
    e.preventDefault();
    setPreviewLoading(true);
    setPreviewError(null);
    setPreview(null);
    setAppliedCode(null);

    const code = discountInput.trim() || null;

    try {
      const res = await checkoutPreview(code);
      setPreview(res.data);
      if (code) {
        setAppliedCode(code);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong while applying your discount code. Please try again.";
      setPreviewError(message);
      console.error("Failed to apply discount code:", err);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setCheckoutError(null);

    const discountCode = appliedCode && preview ? appliedCode : null;

    try {
      const res = await checkoutConfirm(discountCode);
      setOrderResult({
        ...res.data,
        appliedDiscountCode: preview?.appliedDiscountCode ?? null,
      });
      resetDiscountPreview();
      setDiscountInput("");
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
  const subtotal = preview?.subtotal ?? cart.total;
  const total = preview?.finalAmount ?? cart.total;

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
              <div className="mb-4">
                <label
                  htmlFor="discount-code"
                  className="block text-sm text-slate-600 mb-2"
                >
                  Discount code
                </label>
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <input
                    id="discount-code"
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  />
                  <button
                    type="submit"
                    disabled={previewLoading}
                    className="text-sm font-semibold bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  >
                    {previewLoading ? "Applying..." : "Apply"}
                  </button>
                </form>
              </div>

              {appliedCode && preview && (
                <p className="text-sm text-green-700 mb-4">
                  Applied:{" "}
                  <span className="font-mono font-semibold">{appliedCode}</span>
                </p>
              )}

              {previewError && (
                <p className="text-sm text-red-600 mb-4">{previewError}</p>
              )}

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span>${subtotal}</span>
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
                  <span>${total}</span>
                </div>
                {!preview && !previewLoading && (
                  <p className="text-xs text-slate-500 pt-1">
                    Enter a discount code and click Apply to update totals.
                  </p>
                )}
              </div>

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
                  disabled={loading || previewLoading}
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
              {orderResult.couponCode && (
                <p className="text-green-700 pt-2 border-t">
                  You earned coupon:{" "}
                  <span className="font-mono font-semibold">
                    {orderResult.couponCode}
                  </span>
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
