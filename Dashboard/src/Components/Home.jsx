import React, { useEffect } from 'react';
import Dashboard from './Dashboard.jsx';
import TopBar from './TopBar.jsx';
import { ClientServer } from '../ClientServer';

export default function Home() {

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        await ClientServer.get("/me");
      } catch (error) {
        if (error.response?.status === 401) {
          const loginUrl =
            (import.meta.env && import.meta.env.VITE_LOGIN_URL) ||
            "https://stock-trading-nwil.vercel.app/login";
          window.location.href = loginUrl;
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
  );
}
