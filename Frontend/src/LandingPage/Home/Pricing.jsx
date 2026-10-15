import React from 'react';
import "./Home.css";


export default function Pricing() {
  return (
    <div>
      <div className="container mt-5"></div>
      <div className="row">
        <div className="col-4 pl-5 text-center">
          <h1>Unbeatable Pricing</h1>
          <p>We pioneered the concept of discount broking and price transparency in India.Flat fees and no hidden charges </p>
          <a style={{ textDecoration: "none" }} href="#">See Pricing </a> <i className="fa-solid fa-arrow-right" style={{ color: "blue" }}></i>

        </div>
        <div className="col-2"></div>
        <div className="col-6">
          <div className="row text-center">
            <div className="col border p-3">
              <h1 className='mb-3'>₹0</h1>
              <p>Free equity deliver and<br></br> direct mutual funds</p>
            </div>
            <div className="col border p-3">
              <h1 className='mb-3'>₹20</h1>
              <p>Infraday and F&O</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
