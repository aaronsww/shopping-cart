import React from "react";
import { useState } from "react";

function Cart({ items, totalPrice }) {

  const [total, setTotal] = useState(0);

  const cartList = items.map((eachItem) => {
    return (
      <ul>
        <li>{eachItem.title}</li>
        <h3>{eachItem.price}</h3>
      </ul>
    );
  });

  return (
    <div>
      <div>{cartList}</div>
      <h1>{totalPrice}</h1>
    </div>
  );
}

export default Cart;
