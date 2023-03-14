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
  const [count, setCount] = useState(1);

  function addToCart(eachProduct) {
    setCount(count + 1);
    if (!cart.find((item) => item.id === eachProduct.id)) {
      setCart([...cart, eachProduct]);
      increasePrice(eachProduct.price);
      // increasePrice(parseFloat(eachProduct.price.toFixed(2)));
      setLocalPrice(localPrice + eachProduct.price);
      // setLocalPrice(parseFloat((localPrice + eachProduct.price).toFixed(2)));
      console.log(price);
      console.log(localPrice);
    } else {
      increasePrice(eachProduct.price);
      // increasePrice(parseFloat(eachProduct.price.toFixed(2)));
      setLocalPrice(localPrice + eachProduct.price);
      // setLocalPrice(parseFloat((localPrice + eachProduct.price).toFixed(2)));
      console.log(price);
      console.log(localPrice);
    }
  }

  function removeFromCart(eachProduct) {
    setCount(count - 1);
    // decreasePrice(eachProduct.price);
    decreasePrice(parseFloat(eachProduct.price.toFixed(2)));
    // setLocalPrice(localPrice - eachProduct.price);
    setLocalPrice(parseFloat((localPrice - eachProduct.price).toFixed(2)));
    if (localPrice === 0) {
      setCart(
        cart.filter((eachCartProduct) => eachProduct.id != eachCartProduct.id)
        // cart.filter((eachCartProduct) => eachProduct.id === eachCartProduct)
      );
    }
  }

  return (
    <div className="flex m-1 p-1 w-72">
      <img className="h-32" src={eachProduct.image} alt="" />
      <div className="flex flex-col justify-center  ">
        <ul className="flex flex-col justify-between ml-2 ">
          <li className="text-xs">{eachProduct.title}</li>
          <li className="font-bold">${eachProduct.price}</li>
        </ul>
        <div className="flex justify-center items-center mt-3">
          <button
            className="bg-slate-200 hover:bg-slate-300 font-bold text-2xl flex justify-center items-center w-7 h-7 pb-1"
            onClick={() => removeFromCart(eachProduct)}
          >
            -
          </button>
          <span className="mx-4 font-bold">{count}</span>
          <button
            className="bg-slate-200 hover:bg-slate-300 font-bold text-2xl flex justify-center items-center w-7 h-7 pb-1"
            onClick={() => addToCart(eachProduct)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
