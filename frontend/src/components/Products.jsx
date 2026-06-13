import React from "react";
import { useState, useEffect } from "react";
import useCartStore from "../store/useCartStore";
import axios from "axios";

function Products() {
  const products = useCartStore((state) => state.products);
  const setProducts = useCartStore((state) => state.setProducts);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const price = useCartStore((state) => state.cart);
  const increasePrice = useCartStore((state) => state.increasePrice);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function addToCart(eachProduct) {
    if (!cart.find((item) => item.id === eachProduct.id)) {
      setCart([...cart, eachProduct]);
      increasePrice(eachProduct.price);
    } else increasePrice(eachProduct.price);
  }

  let displayProducts = [1, 2, 3, 4, 15, 16, 17, 18, 19];
  const filteredProducts = products.filter((obj) =>
    displayProducts.includes(obj.id)
  );

  return (
    <div>
      <h1 className="flex justify-center text-4xl font-thin my-5">
        Featured Collection
      </h1>
      <div className="ml-20 justify-center flex flex-wrap">
        {filteredProducts.map((eachProduct) => (
          <div className="flex flex-col justify-around m-5 p-5 w-72 border-2 rounded-2xl transform transition duration-500 hover:scale-110 ">
            <img
              className="self-center w-32 h-40"
              src={eachProduct.image}
              alt=""
            />
            <ul>
              <li className="text-slate-600 text-sm">{eachProduct.title}</li>
              <div className="flex justify-between">
                <li className=" text-xl font-bold">${eachProduct.price}</li>
                <h3
                  className=" cursor-pointer font-bold mt-1 transform transition duration-300 hover:scale-125 hover:text-red-500"
                  onClick={() => addToCart(eachProduct)}
                >
                  Add to Cart
                </h3>
              </div>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
