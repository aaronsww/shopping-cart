import React from "react";
import { useState, useEffect } from "react";
import useCartStore from "../store/useCartStore";
import axios from "axios";

function Products() {
  // { onPurchase, data } props

  const products = useCartStore((state) => state.products);
  const setProducts = useCartStore((state) => state.setProducts);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        console.log(res.data);
        (products) => setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <div>{products}</div>;

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
