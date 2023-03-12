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
    <div>
      {cart.map((eachProduct) => (
        <CartProduct eachProduct={eachProduct} />
      ))}
      <div>{price}</div>
    </div>
  );
}

export default Cart;
