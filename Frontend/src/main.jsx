import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './LandingPage/Home/homePage.jsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './LandingPage/signUp/Signup.jsx';
import AboutPage from './LandingPage/About/AboutPage.jsx';
import SupportPage from './LandingPage/Support/SupportPage.jsx';
import Navbar from './LandingPage/Navbar.jsx';
import Footer from './LandingPage/Home/Footer.jsx';
import NotFound from './LandingPage/NotFound.jsx';
import ProductPage from './LandingPage/Products/productPage.jsx';
import PricingPage from './LandingPage/Pricing/PricingPage.jsx';
import { MyProvider } from './AuthContext.jsx';
import Login from './LandingPage/signUp/login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <MyProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/products/" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />

    </BrowserRouter>
  </MyProvider>
)
