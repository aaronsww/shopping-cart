import { useState } from "react";
import "./App.css";

import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";

function App() {
  const [hideHome, setHideHome] = useState(true);
  const [hideProducts, setHideProducts] = useState(false);
  const [hideCart, setHideCart] = useState(false);

  function home() {
    setHideHome(true);
    setHideProducts(false);
    setHideCart(false);
  }

  function products() {
    setHideHome(false);
    setHideProducts(true);
    setHideCart(false);
  }

  function cart() {
    setHideHome(false);
    setHideProducts(false);
    setHideCart(true);
  }

  return (
    <div>
      <ul className="navBar">
        <li></li>
        <li onClick={home}>Home</li>
        <li onClick={products}>Products</li>
        <li onClick={cart}>Cart</li>
      </ul>
      <div>{hideHome && <Home />}</div>
      <div>{hideProducts && <Products />}</div>
      <div>{hideCart && <Cart />}</div>
    </div>
  );
}

export default App;
