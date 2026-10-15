import React from 'react';
import "./Home.css";


export default function Education() {
  return (
    <div>
      <div className="container mt-10 mb-5">
        <div className="row">
          <div className="col-6">
            <img src='/media/education.svg' alt="education"></img>
          </div>
          <div className="col-6">
            <h2 className='mb-3'>Free and open market education</h2>
            <p className='mb-3'>Varsity the largest online stock market education book in the world covering everything from the basicsto advanced trading.</p>
            <a style={{ textDecoration: "none" }} href="#">Versity </a> <i className="fa-solid fa-arrow-right mb-5" style={{ color: "blue" }}></i>
            <p className='mb-3'>TradingQ&A,the most active trading and investment communityin india for all your market realted queries.</p>
            <a style={{ textDecoration: "none" }} href="#">TradigQ&A </a> <i className="fa-solid fa-arrow-right" style={{ color: "blue" }}></i>
          </div>

        </div>
      </div>

    </div>
  )
}
