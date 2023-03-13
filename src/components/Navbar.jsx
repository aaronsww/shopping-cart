import React from "react";
import { Link } from "react-router-dom";

// style={{ color: "#d2effd" }}
// style={{ color: "#e69228" }}

function Navbar() {
  return (
    <ul className="flex items-center justify-around h-28 border-2" >
      <li className="text-5xl font-extrabold" >
        <Link to="/home">FakeShop</Link>
      </li>
      <div className="flex text-2xl font-bold">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li className="ml-16">
          <Link to="/products">Products</Link>
        </li>
        <li className="ml-16">
          <Link to="/contact">Contact</Link>
        </li>
        <li className="ml-16">
          <Link to="/cart">Cart</Link>
        </li>
      </div>
    </ul>
  );
}

export default Navbar;
