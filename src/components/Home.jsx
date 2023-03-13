import React from "react";
import backgroundImage from '../img/bg.jpg';

function Home() {
  return <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}> We are home </div>;
}

export default Home;
