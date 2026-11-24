import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClientServer } from "../ClientServer";
import "./Order.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientServer.get("/allOrders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load orders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;
    return order.mode?.toUpperCase() === activeFilter;
  });

  const buyCount = orders.filter((o) => o.mode?.toUpperCase() === "BUY").length;
  const sellCount = orders.filter((o) => o.mode?.toUpperCase() === "SELL").length;

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="order-error-card" role="alert">
          <p className="error-title">Unable to retrieve orders</p>
          <p className="error-desc">{error}</p>
          <button type="button" className="btn-retry" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Page heading */}
      <div className="orders-header">
        <div>
          <h2>Orders</h2>
          <p>Track and manage your stock orders</p>
        </div>

        {orders.length > 0 && (
          <div className="order-filter-group">
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === "ALL" ? "active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === "BUY" ? "active" : ""}`}
              onClick={() => setActiveFilter("BUY")}
            >
              Buy ({buyCount})
            </button>
            <button
              type="button"
              className={`order-filter-btn ${activeFilter === "SELL" ? "active" : ""}`}
              onClick={() => setActiveFilter("SELL")}
            >
              Sell ({sellCount})
            </button>
          </div>
        )}
      </div>

      {/* Orders table card */}
      <div className="orders-card">
        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">↗</div>
            <h3>No orders yet</h3>
            <p>
              You haven't placed any orders today. Your orders will appear here once you start buying or selling stocks.
            </p>
            <Link to="/" className="btn-explore">
              Explore Watchlist
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <h3>No {activeFilter.toLowerCase()} orders found</h3>
            <p>No orders matched your selected filter criteria.</p>
            <button
              type="button"
              className="btn-retry"
              onClick={() => setActiveFilter("ALL")}
            >
              Show All Orders
            </button>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Order ID</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const isBuy = order.mode?.toUpperCase() === "BUY";
                  const orderStatus = order.status || "COMPLETED";
                  const statusClass =
                    orderStatus === "COMPLETED"
                      ? "status-completed"
                      : orderStatus === "REJECTED"
                      ? "status-rejected"
                      : "status-pending";

                  return (
                    <tr key={order._id || index}>
                      <td>
                        <div className="stock-info">
                          <div className="stock-avatar">
                            {order.name?.charAt(0) || "S"}
                          </div>
                          <span className="stock-name">{order.name}</span>
                        </div>
                      </td>
                      <td className="order-id">
                        #{order._id ? order._id.slice(-6).toUpperCase() : `ORD${index + 1}`}
                      </td>
                      <td>
                        <span className={`order-type ${isBuy ? "buy" : "sell"}`}>
                          {order.mode}
                        </span>
                      </td>
                      <td>
                        <span className="product-type">
                          {order.orderType || "MARKET"}
                        </span>
                      </td>
                      <td>{order.qty}</td>
                      <td>{formatPrice(order.price)}</td>
                      <td className="order-total">
                        {formatPrice((Number(order.qty) || 0) * (Number(order.price) || 0))}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${statusClass}`}
                          title={order.reason || orderStatus}
                        >
                          {orderStatus}
                        </span>
                      </td>
                      <td className="order-date">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="orders-footer">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}
