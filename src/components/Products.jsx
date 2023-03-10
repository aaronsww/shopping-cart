import React from "react";
import { useState, useEffect } from "react";
import useCartStore from "../store/useCartStore";
import axios from "axios";

function Products() {
  // { onPurchase, data } props

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
    }
    else increasePrice(eachProduct.price);
  }

  return (
    <div>
      {products.map((eachProduct) => (
        <div>
          <img className="h-32" src={eachProduct.image} alt="" />
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

  // const list = data.map((eachProduct) => {
  //   return (
  //     <div>
  //       <img className="h-32" src={eachProduct.image} alt="" />
  //       <ul>
  //         <li> name: {eachProduct.title}</li>
  //         <li> price: ${eachProduct.price}</li>
  //         {/* <li>description: {eachProduct.description}</li> */}
  //         <h3 className="text-xl font-bold" onClick={() => onPurchase(eachProduct)}>Add to Cart</h3>
  //       </ul>
  //     </div>
  //   );
  // });

  // return <div>{list}</div>;
}

export default Products;
