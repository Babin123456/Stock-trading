import React from 'react';
import "./Home.css";

export default function Awards() {
  return (
    <div>
      <div className="container mb-5">
        <div className="row">
          <div className="col-6 p-5">
            <img src="/media/largestBroker.svg" alt="Largest Broker Award" className="img-fluid"></img>
          </div>
          <div className="col-6 p-5">
            <h1>Largets Stock broker in India</h1>
            <p className="pb-5">2+ million Zerodha clients contribute to over 15% of all retail order volumes in India daily by  trading and investing in:</p>
            <div className="row">
              <div className="col-6">
                <ul>
                  <li><p>Future and Options </p></li>
                  <li><p>Commodity derivatives</p></li>
                  <li><p>Currency Derivatives</p></li>

                </ul>

              </div>
              <div className="col-6">
                <ul>
                  <li><p>Stock & IPOs</p></li>
                  <li><p>Direct mutual funds</p></li>
                  <li><p>Bonds and Govt. securities</p></li>
                </ul>
              </div>

            </div>
            <img src="media/pressLogos.png" alt="Press Logos" className="img-fluid mt-5"></img>

          </div>
        </div>
      </div>
    </div>
  )
}
