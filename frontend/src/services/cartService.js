import axios from "axios";
import { API_BASE, CUSTOMER_ID } from "../config/constants";

const CART_BASE = `${API_BASE}/api/cart`;

export { CUSTOMER_ID };

export const fetchCart = () => axios.get(`${CART_BASE}/${CUSTOMER_ID}`);

export const addToCart = (productId, quantity = 1) =>
  axios.post(`${CART_BASE}/add`, {
    customerId: CUSTOMER_ID,
    productId,
    quantity,
  });

export const removeFromCart = (productId) =>
  axios.delete(`${CART_BASE}/${CUSTOMER_ID}/item/${productId}`);

export const clearCart = () =>
  axios.delete(`${CART_BASE}/${CUSTOMER_ID}/clear`);

export const getCartItemCount = async () => {
  const res = await fetchCart();
  return (res.data.items ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
};

export const notifyCartUpdated = () => {
  window.dispatchEvent(new Event("cart-updated"));
};
