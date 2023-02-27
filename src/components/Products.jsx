import React from "react";
import { useState } from "react";

function Products({ onPurchase, data }) {

  return (
    <div>
      Products
      <ul>
        <li> name: {data.name}</li>
        <li> price: ${data.price}</li>
        <li>description: {data.description}</li>
        <li onClick={() => onPurchase(data)}>Add to Cart</li>
      </ul>
    </div>
  );
}

export default Products;
