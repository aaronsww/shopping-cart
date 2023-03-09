import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";

function App() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [purchased, setPurchased] = useState([]);

  function addItem(purchasedData) {
    setPurchased(purchasedData);
    console.log(purchased);
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/products"
          element={<Products onPurchase={addItem} data={product} />}
        />
        <Route path="/cart" element={<Cart items={purchased} />} />
      </Routes>
    </BrowserRouter>
  );
}
// useEffect(() => {
//   axios
//     .get("https://pokeapi.co/api/v2/pokemon")
//     .then((res) => {
//       setProducts(res.data.results);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, []);

export default App;
