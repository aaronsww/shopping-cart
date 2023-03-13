import React, {useState} from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";

// style={{ color: "#d2effd" }}
// style={{ color: "#e69228" }}

function Navbar() {

  return (
    <ul className="flex items-center justify-around h-28" style={{backgroundColor: "#e9f2f9"}}>
      <li className="text-5xl font-normal"  style={{color: "#fdae01"}}>
        <Link to="/home">FakeShop</Link>
      </li>
      <div className="flex text-xl font-semibold">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li className="ml-16">
          <Link to="/products">Products</Link>
        </li>
        <li className="ml-16">
          <Link to="/cart">Cart</Link>
        </li>
      </div>
    </ul>
  );
}

export default Navbar;
