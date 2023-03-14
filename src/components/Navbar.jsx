import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";

// style={{ color: "#d2effd" }}
// style={{ color: "#e69228" }}
//

function Navbar() {
  return (
    <ul className="flex items-center justify-around h-20 text-slate-200 bg-black">
      <li className="text-5xl font-bold " style={{ color: "#fdae01" }}>
        <Link to="/home">FakeShop</Link>
      </li>
      <div className="flex text-xl font-semibold ">
        <li className="transform transition duration-300 hover:scale-110  pt-1.5">
          <Link to="/home">Home</Link>
        </li>
        <li className="ml-16 transform transition duration-300 hover:scale-110 pt-1.5">
          <Link to="/products">Products</Link>
        </li>
        <li className="ml-16 transform transition duration-300 hover:scale-110 pb-2">
          <Link to="/cart">
            Cart
            <button className="rounded-full ml-2 p-2 bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M7 22q-.825 0-1.412-.587Q5 20.825 5 20q0-.825.588-1.413Q6.175 18 7 18t1.412.587Q9 19.175 9 20q0 .825-.588 1.413Q7.825 22 7 22Zm10 0q-.825 0-1.412-.587Q15 20.825 15 20q0-.825.588-1.413Q16.175 18 17 18t1.413.587Q19 19.175 19 20q0 .825-.587 1.413Q17.825 22 17 22ZM5.2 4h14.75q.575 0 .875.512q.3.513.025 1.038l-3.55 6.4q-.275.5-.738.775Q16.1 13 15.55 13H8.1L7 15h12v2H7q-1.125 0-1.7-.988q-.575-.987-.05-1.962L6.6 11.6L3 4H1V2h3.25Z"
                />
              </svg>
            </button>
          </Link>
        </li>
      </div>
    </ul>
  );
}

export default Navbar;
