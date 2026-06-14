import axios from "axios";
import { API_BASE, CUSTOMER_ID } from "../config/constants";

const checkoutPayload = () => ({
  customerId: CUSTOMER_ID,
  discountCode: null,
});

export const checkoutPreview = () =>
  axios.post(`${API_BASE}/api/checkout/preview`, checkoutPayload());

export const checkoutConfirm = () =>
  axios.post(`${API_BASE}/api/checkout/confirm`, checkoutPayload());
