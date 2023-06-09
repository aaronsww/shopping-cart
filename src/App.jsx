import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Contact from "./components/Contact";
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
  const [total, setTotal] = useState(0);

  function addItem(purchasedData) {
    setPurchased([...purchased, purchasedData]);
    // console.log(purchased);
    setTotal(total + purchasedData.price);
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home  />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/products"
          element={<Products onPurchase={addItem} data={product} />}
        />
           <Route path="/contact" element={<Contact />} />
        <Route
          path="/cart"
          element={
            <Cart onPurchase={addItem} items={purchased} totalPrice={total} />
          }
        />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;
