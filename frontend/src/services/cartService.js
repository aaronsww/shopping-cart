import axios from "axios";

const API_BASE = "http://localhost:8080/api/cart";
export const CUSTOMER_ID = 1;

export const fetchCart = () => axios.get(`${API_BASE}/${CUSTOMER_ID}`);

export const addToCart = (productId, quantity = 1) =>
  axios.post(`${API_BASE}/add`, {
    customerId: CUSTOMER_ID,
    productId,
    quantity,
  });

export const removeFromCart = (productId) =>
  axios.delete(`${API_BASE}/remove`, {
    params: { customerId: CUSTOMER_ID, productId },
  });

export const clearCart = () =>
  axios.delete(`${API_BASE}/clear`, {
    params: { customerId: CUSTOMER_ID },
  });

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
