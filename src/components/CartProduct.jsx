import React from "react";
import useCartStore from "../store/useCartStore";

function CartProduct({ eachProduct }) {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const price = useCartStore((state) => state.price);
  const increasePrice = useCartStore((state) => state.increasePrice);
  const decreasePrice = useCartStore((state) => state.decreasePrice);

  const [product, setProduct] = useState([]);

  function addToCart(eachProduct) {
    if (!cart.find((item) => item.id === eachProduct.id)) {
      setCart([...cart, eachProduct]);
      increasePrice(eachProduct.price);
    } else increasePrice(eachProduct.price);
  }

  function removeFromCart(eachProduct) {
    decreasePrice(eachProduct.price);
  }

  return (
    <div>
      <img className="h-32" src={eachProduct.image} alt="" />
      <ul>
        <li> name: {eachProduct.title}</li>
        <li> price: ${eachProduct.price}</li>
      </ul>
      <div>
        <button
          className="bg-sky-500 font-xl p-2"
          onClick={() => addToCart(eachProduct)}
        >
          +
        </button>
        <button
          className="ml-2 bg-sky-500 font-xl p-2"
          onClick={() => removeFromCart(eachProduct)}
        >
          -
        </button>
      </div>
    </div>
  );
}

export default CartProduct;
