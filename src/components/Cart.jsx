import React from "react";
import { useState } from "react";
import useCartStore from "../store/useCartStore";
import CartProduct from "./CartProduct";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const price = useCartStore((state) => state.price);
  const increasePrice = useCartStore((state) => state.increasePrice);
  const decreasePrice = useCartStore((state) => state.decreasePrice);

  return (
    <div className="">
      {cart.map((eachProduct) => (
        <CartProduct eachProduct={eachProduct} />
      ))}
      <div className="m-5 text-xl font-bold">Subtotal: ${price}</div>
      <button className="m-5 text-3xl font-bold bg-slate-200 px-16 pt-2 pb-4">Checkout</button>
    </div>
  );
}

export default Cart;
