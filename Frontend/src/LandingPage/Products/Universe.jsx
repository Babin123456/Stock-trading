import React from 'react';
// import Hero from './Hero';
import { Link } from 'react-router-dom';

export default function Universe() {
  return (
    <div className='container mt-5'>
      <div className="row text-center">
        <h1>The Zerodha universe</h1>
        <p>extend your trading and investment experince even further with our partner platforms.</p>

        <div className='col-4 p-3 mt-5'>
          <img src="/media/smallcaseLogo.png" />
          <p className='text-muted text-small'>Thematic investment platform</p>
        </div>
        <div className='col-4 p-3 mt-5'>
          <img src="/media/sensibullLogo.svg " />
          <p className='text-muted text-small'></p>
        </div>
        <div className='col-4 p-3 mt-5'>
          <img src="/media/sensibullLogo.svg " />
          <p className='text-muted text-small'></p>
        </div>
        <div className='col-4 p-3 mt-5'>
          <img src="media/zerodhaFundhouse.png" />
          <p className='text-muted text-small'></p>
        </div>
        <div className='col-4 p-3 mt-5'>
          <img src="/media/goldenpiLogo.png" />
          <p className='text-muted text-small'></p>
        </div>
        <div className='col-4 p-3 mt-5'>
          <img src="/media/goldenpiLogo.png" />
          <p className='text-muted text-small'></p>
        </div>
        <button style={{ width: "30%", margin: "0 auto" }} type="button" className="btn btn-primary fs-5">
          <Link className='SignupForm' to="/signup">Signup Now </Link>
        </button>


      </div>

    </div>
  )
}
