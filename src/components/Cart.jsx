import React from "react";
import { useState } from "react";

function Cart({ items, totalPrice }) {
   
  const cartList = items.map((eachItem) => {
    return (
      <div>
        <img className="h-32"  src={eachItem.image} alt="" />
        <ul>
          <li>{eachItem.title}</li>
          <h3>{eachItem.price}</h3>
        </ul>
      </div>
    );
  });

  return (
    <div>
      <div>{cartList}</div>
      <h1 className="font-bold text-4xl">{totalPrice}</h1>
    </div>
  );
}

export default Cart;
