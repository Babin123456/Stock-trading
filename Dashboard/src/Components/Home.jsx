import React from 'react';
import Dashboard from './Dashboard.jsx';
import TopBar from './TopBar.jsx';
import { useEffect } from "react";
import { ClientServer } from '../ClientServer';

export default function Home() {

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const res = await ClientServer.get("/me");
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = "https://stock-trading-nwil.vercel.app/login";
        }
      }
    };

    getLoggedInUser();
  }, []);
  return (
    <div>
      <TopBar />
      <Dashboard />
    </div>
  )
}
