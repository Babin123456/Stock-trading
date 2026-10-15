import "./Home/Home.css";
import React from 'react';
import { Link } from "react-router-dom";

export default function OpenAccount() {
  return (
    <div>
      <div className="container p-5 mt-5">
        <div className="row text-center">
          <img src="/media/homeHero.png" alt="Hero Image" className="mb-5"></img>
          <h1 className="mt-5">Open a Zerodha Account</h1>
          <p>Modern Platform and apps, ₹0 investments,and flat ₹20 intraday and F&O trades.</p>
          <button style={{ width: "30%", margin: "0 auto" }} type="button" className="btn btn-primary fs-5">
            <Link className="SignupForm" to="/signup">Signup Now</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
