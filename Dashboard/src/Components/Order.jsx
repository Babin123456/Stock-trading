import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClientServer } from '../ClientServer.js';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ClientServer.get("/allOrders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.message || "Failed to load orders. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'ALL') return true;
    return order.mode?.toUpperCase() === activeFilter;
  });

  const buyCount = orders.filter((o) => o.mode?.toUpperCase() === 'BUY').length;
  const sellCount = orders.filter((o) => o.mode?.toUpperCase() === 'SELL').length;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h3 className="title">Orders ({orders.length})</h3>
        {orders.length > 0 && (
          <div className="order-filter-group">
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === 'BUY' ? 'active' : ''}`}
              onClick={() => setActiveFilter('BUY')}
            >
              Buy ({buyCount})
            </button>
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === 'SELL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('SELL')}
            >
              Sell ({sellCount})
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="order-loading-container" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="order-error-card" role="alert">
          <p className="error-title">Unable to retrieve orders</p>
          <p className="error-desc">{error}</p>
          <button type="button" className="btn btn-blue" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders">
          <div className="no-orders">
            <p>You haven't placed any orders today</p>
            <Link to="/" className="btn btn-blue">
              Explore Watchlist
            </Link>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders" style={{ marginTop: "40px" }}>
          <p>No {activeFilter.toLowerCase()} orders found</p>
          <button
            type="button"
            className="btn btn-grey"
            onClick={() => setActiveFilter('ALL')}
          >
            Show All Orders
          </button>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Instrument</th>
                <th>Product</th>
                <th>Qty.</th>
                <th>Avg. Price</th>
                <th>Total Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const isBuy = order.mode?.toUpperCase() === 'BUY';
                const formattedTime = order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })
                  : '—';
                const totalVal = (Number(order.qty || 0) * Number(order.price || 0)).toFixed(2);
                const orderStatus = order.status || 'COMPLETED';
                const statusClass =
                  orderStatus === 'COMPLETED'
                    ? 'status-completed'
                    : orderStatus === 'REJECTED'
                    ? 'status-rejected'
                    : 'status-pending';

                return (
                  <tr key={order._id || index}>
                    <td className="text-muted">{formattedTime}</td>
                    <td>
                      <span className={`order-badge ${isBuy ? 'badge-buy' : 'badge-sell'}`}>
                        {order.mode}
                      </span>
                    </td>
                    <td className="instrument-name">{order.name}</td>
                    <td>{order.orderType || 'MARKET'}</td>
                    <td>{order.qty}</td>
                    <td>₹{Number(order.price || 0).toFixed(2)}</td>
                    <td>₹{totalVal}</td>
                    <td>
                      <span
                        className={`status-pill ${statusClass}`}
                        title={order.reason || orderStatus}
                      >
                        {orderStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
