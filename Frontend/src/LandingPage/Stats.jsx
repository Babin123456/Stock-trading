import React from 'react'
import "./Home/Home.css";

export default function Stats() {
  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <h1 className='pb-5 fs-2'>Trust with Confidence</h1>
            <h2 className='fs-4'>Customer first always</h2>
            <p className='text-muted'>That's why 1.3+ crore customer trust Zerodha with &#x20B9;3.5+ lakh Crores worth of equity investments. </p>
            <br></br>
            <h2 className='fs-4'> No spam or gimmicks</h2>
            <p className='text-muted'>No gimmicks, spam, "gamifiaction" or annoying push notifiactions.High quality apps that you use at your pace, the way you like. </p>
            <br></br>
            <h2 className='fs-4'>The Zerodha universe</h2>
            <p className='text-muted'>Not just an app ,but a whole Ecosystem,our investments in 30+ fintech startups offer you tailored srevices specific to your needs. </p>
            <br></br>
            <h2 className='fs-4'>Do better with money</h2>
            <p className='text-muted'>with initiatives like Nudge and kill Switch.we just don't facilitate transactions , but actively help you do better with your money.</p>
          </div>
          <div className="col-6 p-5">
            <img src="/media/ecosystem.png" alt="ecosystem" style={{ width: "90%" }}></img>
            <div className=' text-center '>
              <a style={{ textDecoration: "none" }} href="#">Explore our products </a> <i className="fa-solid fa-arrow-right" style={{ color: "blue" }}></i>
              <a style={{ textDecoration: "none" }} href="#">Try kite</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
