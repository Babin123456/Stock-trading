# 📊 Stock Trading Dashboard

> A full-stack trading dashboard built to simulate the experience of managing a personal stock portfolio.

**Watch the market. Track your positions. Understand your portfolio.**

---

## ⚡ What is this?

Stock Trading Dashboard is a full-stack web application designed around one simple idea:

**Your portfolio should tell you a story, not just show you numbers.**

The application brings together:

- 📌 Watchlist monitoring
- 💼 Holdings
- 📈 Positions
- 💰 Portfolio value
- 📉 Profit & Loss
- 📊 Data visualization
- 🔐 Secure authentication

The project is built with a React-based frontend and an Express/MongoDB backend, with authentication handled using JWT and HTTP-only cookies.

---

## 🖥️ Interface

### Dashboard

The dashboard acts as the central control room for the portfolio.

```text
┌─────────────────────────────────────────────────────────────┐
│  STOCK TRADING                               👤 USER        │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  WATCHLIST   │              PORTFOLIO                      │
│              │                                              │
│  NIFTY 50    │   ₹29,875        ₹31,428       ₹1,553       │
│  SENSEX      │   Investment      Current       P&L         │
│  INFY        │                                              │
│  ONGC        │   ───────────────────────────────────────    │
│  TCS         │                                              │
│  WIPRO       │             PORTFOLIO CHART                 │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘



⚙️ Run Locally

1. Clone
git clone https://github.com/MUSKANNISHAD/Stock-trading.git
cd Stock-trading

2.Backend
cd backend
npm install

PORT=3000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret

npm run dev

3. Dashboard
cd Dashboard
npm install

create .env
VITE_API_URL=http://localhost:3000

start vite
npm run dev
