import "./Home.css";
import React from 'react';
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div>
      <div className="container p-5">
        <div className="row text-center">
          <img src="/media/homeHero.png" alt="Hero Image" className="mb-5"></img>
          <h1 className="mt-5">Invest in Everything</h1>
          <p>Online platform to invest in stocks, derivatives, mutual funds, and more.</p>
          <button style={{ width: "30%", margin: "0 auto" }} type="button" className="btn btn-primary fs-5" >
            <Link className="SignupForm" to="/signup">Signup Now</Link></button>
        </div>
      </div>
    </div>
  )
}
