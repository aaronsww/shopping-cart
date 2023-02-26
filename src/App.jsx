import { useState } from "react";
import "./App.css";

import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";

function App() {
  const [product, setProduct] = useState({
    name: "sweater",
    price: 48,
    description: "Ut fugiat minim qui voluptate culpa.",
  });

  const [products, setProducts] = useState([]);

  const [showComponent, setShowComponent] = useState(1);

  const [purchased, setPurchased] = useState({});

  function addItem(purchasedData) {
    setPurchased(purchasedData);
    console.log(purchased);
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

  return (
    <div>
      <ul className="navBar">
        <li></li>
        <li onClick={() => setShowComponent(1)}>Home</li>
        <li onClick={() => setShowComponent(2)}>Products</li>
        <li onClick={() => setShowComponent(3)}>Cart</li>
      </ul>
      <div>{showComponent == 1 && <Home />}</div>
      <div>
        {showComponent == 2 && <Products onPurchase={addItem} data={product} />}
      </div>
      <div>{showComponent == 3 && <Cart items={purchased} />}</div>
    </div>
  );
}

export default App;
