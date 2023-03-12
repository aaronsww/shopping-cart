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

  let displayProducts = [1,2,3,415,16,17,18,19]
  const filteredProducts = products.filter((obj) => displayProducts.includes(obj.id));

  return (
    <div className="flex flex-wrap">
      {filteredProducts.map((eachProduct) => (
        <div className=" m-5 p-5 w-72 bg-sky-300">
          <img className=" h-40" src={eachProduct.image} alt="" />
          <ul>
            <li> name: {eachProduct.title}</li>
            <li> price: ${eachProduct.price}</li>
            <h3
              className="text-xl font-bold"
              onClick={() => addToCart(eachProduct)}
            >
              Add to Cart
            </h3>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Products;
