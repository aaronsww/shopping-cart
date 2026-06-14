import React from "react";
import backgroundImage from "../img/bg.jpg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-8xl font-bold pl-40 pt-24">
        Feel <br /> Authentic <br /> Peace
      </div>
      <button className="ml-40 mt-10 bg-black text-white pr-6 pl-7 py-2">
        <Link className="flex" to="/products">
          Shop Now 
          <svg
            className="mt-1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="18"
            viewBox="0 0 24 24"
          >
            <path fill="white" d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4Z" />
          </svg>
        </Link>
      </button>
    </div>
  );
}

export default Home;
