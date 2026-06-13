import React from "react";
import { useState } from "react";
import useCartStore from "../store/useCartStore";
import CartProduct from "./CartProduct";

function Cart() {
  const cart = useCartStore((state) => state.cart);

  const price = useCartStore((state) => state.price);

  return (
    <div >
      <div className="flex-col flex flex-wrap h-96 ml-40 mt-10 justify-around items-start">
        {cart.map((eachProduct) => (
          <CartProduct eachProduct={eachProduct} />
        ))}
      </div>
      <div className= "ml-40">
        <div className="m-5 text-xl font-bold">Subtotal: ${price}</div>
        <button className="m-5 text-3xl font-bold bg-slate-200 px-16 pt-2 pb-4 hover:bg-slate-300">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
