import React from "react";
import { useState, useEffect } from "react";
import {
  fetchStats,
  fetchDiscounts,
  createDiscount,
  activateDiscount,
  deactivateDiscount,
} from "../services/adminService";

function Admin() {
  const [stats, setStats] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [everyNthOrder, setEveryNthOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  async function loadData() {
    try {
      const [statsRes, discountsRes] = await Promise.all([
        fetchStats(),
        fetchDiscounts(),
      ]);
      setStats(statsRes.data);
      setDiscounts(discountsRes.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateDiscount(e) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      const nthValue = everyNthOrder.trim()
        ? Number(everyNthOrder)
        : null;
      await createDiscount(code.trim(), Number(percentage), nthValue);
      setCode("");
      setPercentage("");
      setEveryNthOrder("");
      await loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create discount code.";
      setFormError(message);
      console.error("Failed to create discount:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleDiscount(discount) {
    try {
      if (discount.active) {
        await deactivateDiscount(discount.code);
      } else {
        await activateDiscount(discount.code);
      }
      await loadData();
    } catch (err) {
      console.error("Failed to update discount:", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-thin mb-8">Admin</h1>

      <section className="mb-10 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Stats</h2>
        {stats ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500">Total Revenue</p>
              <p className="text-xl font-bold">${stats.totalRevenue}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500">Total Orders</p>
              <p className="text-xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500">Total Items Sold</p>
              <p className="text-xl font-bold">{stats.totalItemsSold}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500">Total Discounts Given</p>
              <p className="text-xl font-bold">${stats.totalDiscountsGiven}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Loading stats...</p>
        )}

        {stats?.discountUsage?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Discount Codes Used
            </h3>
            <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {stats.discountUsage.map((usage) => (
                <li
                  key={usage.code}
                  className="flex justify-between items-center px-4 py-3 text-sm bg-white"
                >
                  <div>
                    <span className="font-mono font-semibold">{usage.code}</span>
                    <span className="text-slate-500 ml-2">
                      used {usage.usageCount} time{usage.usageCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <span className="font-semibold text-green-700">
                    -${usage.totalDiscount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Discount Codes</h2>
        <p className="text-xs text-slate-500 mb-4">
          Leave &ldquo;Every Nth Order&rdquo; empty for manual codes. Set a
          value (e.g. 3) to auto-apply on every 3rd order.
        </p>

        <form onSubmit={handleCreateDiscount} className="flex flex-wrap gap-3 mb-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
            className="flex-1 min-w-[8rem] border border-slate-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="% off"
            min="1"
            step="0.01"
            className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            value={everyNthOrder}
            onChange={(e) => setEveryNthOrder(e.target.value)}
            placeholder="Every Nth Order"
            min="1"
            step="1"
            className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50"
          >
            Create
          </button>
        </form>

        {formError && (
          <p className="text-sm text-red-600 mb-4">{formError}</p>
        )}

        {discounts.length === 0 ? (
          <p className="text-slate-500 text-sm">No discount codes yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {discounts.map((discount) => (
              <li
                key={discount.id}
                className="flex justify-between items-center py-3 text-sm"
              >
                <div>
                  <span className="font-semibold font-mono">
                    {discount.code}
                  </span>
                  <span className="text-slate-500 ml-2">
                    {discount.percentage}% off
                  </span>
                  {discount.everyNthOrder ? (
                    <span className="text-slate-500 ml-2">
                      · every {discount.everyNthOrder} orders
                    </span>
                  ) : (
                    <span className="text-slate-500 ml-2">· manual</span>
                  )}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      discount.active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {discount.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleDiscount(discount)}
                  className="text-xs border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50"
                >
                  {discount.active ? "Deactivate" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Admin;
