import React from 'react';
import "./Footer.css";

export default function Footer() {
  return (
    <div className="container border-top mb-5 mt-8 pt-5">
      <div className="row">
        <div className="col">
          <img src="/media/logo.svg" alt="logo" style={{ width: "50%" }} /> <br></br>
          <br></br>
          <p> &copy; 2010-2024, not zerodha broking Ltd. <br></br>All rights reserves.</p>
        </div>
        <div className="col">
          <h5>Company</h5>
          <a href="#" style={{ textDecoration: "none" }}>About</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Products</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Pricing</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Refferal Programme</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Carrers</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Zerodha.tech</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Press & media</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Zerodha care(CSR)</a> <br></br>

        </div>
        <div className="col">
          <h5>Support</h5>
          <a href="#" style={{ textDecoration: "none" }}> Contact</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Support Portal</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>Z-Connect blog</a><br></br>
          <a href="#" style={{ textDecoration: "none" }}>List of Charges</a><br></br>
          <a href="#" style={{ textDecoration: "none" }} >Downloads & Resources</a>
        </div>
        <div className="col">
          <h5>Account</h5>
          <a style={{ textDecoration: "none" }} href="#">Open an Account</a><br></br>
          <a style={{ textDecoration: "none" }} href="#"> Fund Transfer</a><br></br>
          <a style={{ textDecoration: "none" }} href="#"> 60 day challange</a>

        </div>

      </div>
      <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
        <p>
          Zerodha Broking Ltd.: Member of NSE​ &​ BSE – SEBI Registration no.:
          INZ000031633 CDSL: Depository services through Zerodha Securities
          Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015 Commodity Trading
          through Zerodha Commodities Pvt. Ltd. MCX: 46025 – SEBI Registration
          no.: INZ000038238 Registered Address: Zerodha Broking Ltd.,
          #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
          J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any
          complaints pertaining to securities broking please write to
          complaints@zerodha.com, for DP related to dp@zerodha.com. Please
          ensure you carefully read the Risk Disclosure Document as prescribed
          by SEBI | ICF
        </p>
        <p>
          Procedure to file a complaint on SEBI SCORES: Register on SCORES
          portal. Mandatory details for filing complaints on SCORES: Name,
          PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
          Communication, Speedy redressal of the grievances
        </p>

        <p>
          Investments in securities market are subject to market risks; read
          all the related documents carefully before investing.
        </p>
        <p>
          "Prevent unauthorised transactions in your account. Update your
          mobile numbers/email IDs with your stock brokers. Receive
          information of your transactions directly from Exchange on your
          mobile/email at the end of the day. Issued in the interest of
          investors. KYC is one time exercise while dealing in securities
          markets - once KYC is done through a SEBI registered intermediary
          (broker, DP, Mutual Fund etc.), you need not undergo the same
          process again when you approach another intermediary." Dear
          Investor, if you are subscribing to an IPO, there is no need to
          issue a cheque. Please write the Bank account number and sign the
          IPO application form to authorize your bank to make payment in case
          of allotment. In case of non allotment the funds will remain in your
          bank account. As a business we don't give stock tips, and have not
          authorized anyone to trade on behalf of others. If you find anyone
          claiming to be part of Zerodha and offering such services, please
          create a ticket here.
        </p>
      </div>
    </div>
  )
}
