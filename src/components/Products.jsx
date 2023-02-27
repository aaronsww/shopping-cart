import React from "react";
import { useState } from "react";

function Products() {

  const [product, setProduct] = useState({
    name: "sweater",
    price: 48,
    description: "Ut fugiat minim qui voluptate culpa.",
  });

  return (
    <div>
      Products
      <ul>
        <li> name: {product.name}</li>
        <li> price: ${product.price}</li>
        <li>description: {product.description}</li>
        <li onClick={() => onPurchase(product)}>Add to Cart</li>
      </ul>
    </div>
  );
}

export default Products;
