import axios from "axios";
import { API_BASE, CUSTOMER_ID } from "../config/constants";

const checkoutPayload = (discountCode) => ({
  customerId: CUSTOMER_ID,
  discountCode: discountCode || null,
});

export const checkoutPreview = (discountCode) =>
  axios.post(`${API_BASE}/api/checkout/preview`, checkoutPayload(discountCode));

export const checkoutConfirm = (discountCode) =>
  axios.post(`${API_BASE}/api/checkout/confirm`, checkoutPayload(discountCode));
