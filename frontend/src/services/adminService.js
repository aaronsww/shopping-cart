import axios from "axios";
import { API_BASE, ADMIN_KEY } from "../config/constants";

const adminHeaders = { "X-ADMIN-KEY": ADMIN_KEY };

export const fetchStats = () =>
  axios.get(`${API_BASE}/api/admin/stats`, { headers: adminHeaders });

export const fetchDiscounts = () =>
  axios.get(`${API_BASE}/api/admin/discounts`, { headers: adminHeaders });

export const createDiscount = (code, percentage, everyNthOrder = null) =>
  axios.post(
    `${API_BASE}/api/admin/discounts`,
    { code, percentage, everyNthOrder },
    { headers: adminHeaders }
  );

export const activateDiscount = (code) =>
  axios.put(
    `${API_BASE}/api/admin/discounts/activate/${encodeURIComponent(code)}`,
    null,
    { headers: adminHeaders }
  );

export const deactivateDiscount = (code) =>
  axios.put(
    `${API_BASE}/api/admin/discounts/deactivate/${encodeURIComponent(code)}`,
    null,
    { headers: adminHeaders }
  );
