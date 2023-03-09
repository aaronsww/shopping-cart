import React from "react";
import { useState } from "react";

function Products({ onPurchase, data }) {
  const list = data.map((eachProduct) => {
    return (
      <div>
        <img className="h-32" src={eachProduct.image} alt="" />
        <ul>
          <li> name: {eachProduct.title}</li>
          <li> price: ${eachProduct.price}</li>
          {/* <li>description: {eachProduct.description}</li> */}
          <h3 className="text-xl font-bold" onClick={() => onPurchase(eachProduct)}>Add to Cart</h3>
        </ul>
      </div>
    );
  });

  return <div>{list}</div>;
}

export default Products;
