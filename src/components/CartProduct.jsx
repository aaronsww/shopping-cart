import React from "react";
import useCartStore from "../store/useCartStore";
import { useState, useEffect } from "react";

function CartProduct({ eachProduct }) {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const price = useCartStore((state) => state.price);
  const increasePrice = useCartStore((state) => state.increasePrice);
  const decreasePrice = useCartStore((state) => state.decreasePrice);

  const [localPrice, setLocalPrice] = useState(0);

  function addToCart(eachProduct) {
    if (!cart.find((item) => item.id === eachProduct.id)) {
      setCart([...cart, eachProduct]);
      increasePrice(eachProduct.price);
      setLocalPrice(localPrice + eachProduct.price);
    } else {
      increasePrice(eachProduct.price);
      setLocalPrice(localPrice + eachProduct.price);
    }
  }

  function removeFromCart(eachProduct) {
    decreasePrice(eachProduct.price);
    setLocalPrice(localPrice - eachProduct.price);
    if (localPrice === 0) {
      setCart(
        cart.filter((eachCartProduct) => eachProduct.id === eachCartProduct)
      );
    }
  }

  return (
    <div className=" m-5 p-5 w-72 bg-sky-300">
      <img className="h-32" src={eachProduct.image} alt="" />
      <ul>
        <li> name: {eachProduct.title}</li>
        <li> price: ${eachProduct.price}</li>
      </ul>
      <div>
        <button
          className="bg-sky-500 font-xl p-2"
          onClick={() => addToCart(eachProduct)}
        >
          +
        </button>
        <button
          className="ml-2 bg-sky-500 font-xl p-2"
          onClick={() => removeFromCart(eachProduct)}
        >
          -
        </button>
      </div>
    </div>
  );
}

export default CartProduct;
