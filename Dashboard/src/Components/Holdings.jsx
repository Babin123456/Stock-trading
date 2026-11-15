import { useEffect, useState, useCallback, useMemo } from 'react';
import { ClientServer } from '../ClientServer.js';
import { VerticalGraph } from './VerticalGraph.jsx';

export default function Holdings() {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ClientServer.get("/allHoldings");
      setAllHoldings(response.data || []);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load holdings. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHoldings();
  }, [fetchHoldings]);

  // Dynamic portfolio calculations
  const { totalInvestment, currentValue, totalPL, plPercentage, isProfit } = useMemo(() => {
    const investment = allHoldings.reduce(
      (acc, stock) => acc + (Number(stock.avg) || 0) * (Number(stock.qty) || 0),
      0
    );
    const value = allHoldings.reduce(
      (acc, stock) => acc + (Number(stock.price) || 0) * (Number(stock.qty) || 0),
      0
    );
    const pl = value - investment;
    const plPct = investment > 0 ? (pl / investment) * 100 : 0;
    return {
      totalInvestment: investment,
      currentValue: value,
      totalPL: pl,
      plPercentage: plPct,
      isProfit: pl >= 0,
    };
  }, [allHoldings]);

  // Chart data
  const data = useMemo(() => {
    const labels = allHoldings.map((stock) => stock.name);
    return {
      labels,
      datasets: [
        {
          label: "Stock price",
          data: allHoldings.map((stock) => stock.price),
          backgroundColor: "rgba(255,99,132,0.5)",
        },
      ],
    };
  }, [allHoldings]);

  // Formatted strings with Indian numbering system
  const [invWhole, invFraction] = totalInvestment
    .toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split(".");

  const [currWhole, currFraction] = currentValue
    .toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split(".");

  const formattedPL = Math.abs(totalPL).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const plPrefix = isProfit ? "+" : "-";
  const plPctText = `${isProfit ? "+" : ""}${plPercentage.toFixed(2)}%`;

  if (isLoading) {
    return (
      <div className="holdings-container">
        <h3 className="title">Holdings</h3>
        <div
          className="orders-loading"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#888",
            fontSize: "15px",
          }}
        >
          Loading your portfolio holdings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-container">
        <h3 className="title">Holdings</h3>
        <div
          className="holdings-error"
          style={{
            textAlign: "center",
            padding: "50px 20px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            margin: "20px 0",
          }}
        >
          <p style={{ color: "#d64c4c", fontSize: "15px", marginBottom: "16px" }}>
            {error}
          </p>
          <button
            type="button"
            onClick={fetchHoldings}
            style={{
              padding: "9px 20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#387ed1",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <div
          className="orders-empty"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            border: "1px dashed #e0e0e0",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#333",
              margin: "0 0 8px 0",
            }}
          >
            No holdings yet
          </h3>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Your holdings portfolio is currently empty. Executed BUY orders will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Curr. val</th>
                  <th>P&L</th>
                  <th>Net Chg.</th>
                  <th>Day Chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const qty = Number(stock.qty) || 0;
                  const avg = Number(stock.avg) || 0;
                  const price = Number(stock.price) || 0;
                  const curValue = price * qty;
                  const pnl = curValue - avg * qty;
                  const isStockProfit = pnl >= 0.0;
                  const profClass = isStockProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={stock._id || index}>
                      <td>{stock.name}</td>
                      <td>{qty}</td>
                      <td>{avg.toFixed(2)}</td>
                      <td>{price.toFixed(2)}</td>
                      <td>{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        {pnl.toFixed(2)}
                      </td>
                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <h5>
                {invWhole}.<span>{invFraction}</span>{" "}
              </h5>
              <p>Total Investment</p>
            </div>
            <div className="col">
              <h5>
                {currWhole}.<span>{currFraction}</span>{" "}
              </h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5
                className={isProfit ? "profit" : "loss"}
                style={{
                  color: isProfit ? "rgb(72, 194, 55)" : "rgb(250, 118, 78)",
                }}
              >
                {plPrefix}
                {formattedPL} ({plPctText})
              </h5>
              <p>P&L</p>
            </div>
          </div>
          <VerticalGraph data={data} />
        </>
      )}
    </>
  );
}
