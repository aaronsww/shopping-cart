import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <ul className="navBar">
      <li></li>
      <li>
        <Link to="/home">Home</Link>
      </li>
      <li>
        <Link to="/products">Products</Link>
      </li>
      <li>
        <Link to="/cart">Cart</Link>
      </li>
    </ul>
  );
}

export default Navbar;
