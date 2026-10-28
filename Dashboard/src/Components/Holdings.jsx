import React, { useEffect, useState } from 'react';
import { ClientServer } from '../ClientServer.js';
import { VerticalGraph } from './VerticalGraph.jsx';

export default function Holdings() {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ClientServer.get("/allHoldings");
      setAllHoldings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching holdings:", err);
      setError(err.response?.data?.message || "Failed to load holdings portfolio. Please verify backend connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + (Number(stock.avg || 0) * Number(stock.qty || 0)),
    0
  );

  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + (Number(stock.price || 0) * Number(stock.qty || 0)),
    0
  );

  const totalPL = currentValue - totalInvestment;
  const isOverallProfit = totalPL >= 0;
  const plPercentage = totalInvestment > 0 ? ((totalPL / totalInvestment) * 100).toFixed(2) : "0.00";

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price (₹)",
        data: allHoldings.map((stock) => Number(stock.price || 0)),
        backgroundColor: "rgba(65, 132, 243, 0.6)"
      },
    ]
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
      <h3 className='title'>Holdings ({allHoldings.length})</h3>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#777" }}>
          <p>Loading your holdings...</p>
        </div>
      ) : error ? (
        <div style={{ background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: "4px", padding: "20px", textAlign: "center", margin: "20px 0" }}>
          <p style={{ color: "#c62828", margin: "0 0 10px 0", fontWeight: 600 }}>Error loading holdings</p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 15px 0" }}>{error}</p>
          <button type="button" className="btn btn-blue" onClick={fetchHoldings}>
            Try Again
          </button>
        </div>
      ) : allHoldings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p>No holdings found in your portfolio.</p>
          <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
            Select stocks from the watchlist to place your first order.
          </p>
        </div>
      ) : (
        <>
          <div className='order-table'>
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. Cost</th>
                  <th>LTP</th>
                  <th>Curr. Val</th>
                  <th>P&L</th>
                  <th>Net Chg.</th>
                  <th>Day Chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const qty = Number(stock.qty || 0);
                  const avg = Number(stock.avg || 0);
                  const price = Number(stock.price || 0);
                  const curStockVal = price * qty;
                  const profitLoss = curStockVal - (avg * qty);
                  const isProfit = profitLoss >= 0;
                  const profClass = isProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={stock._id || index}>
                      <td><strong>{stock.name}</strong></td>
                      <td>{qty}</td>
                      <td>{avg.toFixed(2)}</td>
                      <td>{price.toFixed(2)}</td>
                      <td>{curStockVal.toFixed(2)}</td>
                      <td className={profClass}>
                        {profitLoss >= 0 ? `+${profitLoss.toFixed(2)}` : profitLoss.toFixed(2)}
                      </td>
                      <td className={profClass}>{stock.net || "0.00%"}</td>
                      <td className={dayClass}>{stock.day || "0.00%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className='row'>
            <div className='col'>
              <h5>₹{formatCurrency(totalInvestment)}</h5>
              <p>Total Investment</p>
            </div>
            <div className='col'>
              <h5>₹{formatCurrency(currentValue)}</h5>
              <p>Current Value</p>
            </div>
            <div className='col'>
              <h5 className={isOverallProfit ? "profit" : "loss"}>
                {isOverallProfit ? "+" : ""}
                {formatCurrency(totalPL)} ({isOverallProfit ? "+" : ""}{plPercentage}%)
              </h5>
              <p>P&L</p>
            </div>
          </div>

          {allHoldings.length > 0 && <VerticalGraph data={data} />}
        </>
      )}
    </>
  );
}
