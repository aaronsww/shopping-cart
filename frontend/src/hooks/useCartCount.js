import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getCartItemCount } from "../services/cartService";

export default function useCartCount() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  const refreshCount = useCallback(async () => {
    try {
      setCount(await getCartItemCount());
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount, location.pathname]);

  useEffect(() => {
    window.addEventListener("cart-updated", refreshCount);
    return () => window.removeEventListener("cart-updated", refreshCount);
  }, [refreshCount]);

  return count;
}
