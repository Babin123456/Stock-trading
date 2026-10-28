import React, { useContext, useState, useEffect } from "react";
import "./BuyActionWindow.css";
import { GeneralContext } from "./GeneralContext.jsx";
import { ClientServer } from '../ClientServer.js';

export const BuyActionWindow = ({ uid, initialMode = "BUY", defaultPrice = 0.0 }) => {
    const { closeBuyWindow } = useContext(GeneralContext);

    const [mode, setMode] = useState(initialMode);
    const [stockQuantity, setStockQuantity] = useState(1);
    const [stockPrice, setStockPrice] = useState(Number(defaultPrice) || 100.0);
    const [orderType, setOrderType] = useState("MARKET");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeBuyWindow();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [closeBuyWindow]);

    const handleOrderSubmit = async (e) => {
        if (e) e.preventDefault();
        const qtyNum = Number(stockQuantity);
        const priceNum = Number(stockPrice);

        if (!qtyNum || qtyNum <= 0) {
            setFeedback({ type: "error", message: "Quantity must be greater than 0" });
            return;
        }

        if (!priceNum || priceNum <= 0) {
            setFeedback({ type: "error", message: "Price must be greater than 0" });
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await ClientServer.post("/newOrder", {
                name: uid,
                qty: qtyNum,
                price: priceNum,
                mode: mode,
                orderType: orderType
            });

            setFeedback({
                type: "success",
                message: response.data?.message || `${mode} order placed successfully!`
            });

            setTimeout(() => {
                closeBuyWindow();
            }, 1200);
        } catch (error) {
            console.error("Order submission failed:", error);
            setFeedback({
                type: "error",
                message: error.response?.data?.message || `Failed to execute ${mode} order`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const marginRequired = (Number(stockQuantity || 0) * Number(stockPrice || 0)).toFixed(2);
    const isBuy = mode === "BUY";

    return (
        <div className="modal-backdrop" onClick={closeBuyWindow}>
            <div
                className={`container ${isBuy ? 'buy-mode' : 'sell-mode'}`}
                id="buy-window"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-window-title"
            >
                <div className="header">
                    <div className="header-info">
                        <h3 id="order-window-title">
                            {mode} {uid} <span>x {stockQuantity} Qty</span>
                        </h3>
                        <div className="order-mode-toggle">
                            <button
                                type="button"
                                className={`mode-toggle-btn ${isBuy ? 'active-buy' : ''}`}
                                onClick={() => setMode("BUY")}
                            >
                                BUY
                            </button>
                            <button
                                type="button"
                                className={`mode-toggle-btn ${!isBuy ? 'active-sell' : ''}`}
                                onClick={() => setMode("SELL")}
                            >
                                SELL
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={closeBuyWindow}
                        aria-label="Close trading window"
                    >
                        &times;
                    </button>
                </div>

                <div className="tab">
                    <button
                        type="button"
                        className={orderType === "MARKET" ? "active-tab" : ""}
                        onClick={() => setOrderType("MARKET")}
                    >
                        Regular (Market)
                    </button>
                    <button
                        type="button"
                        className={orderType === "LIMIT" ? "active-tab" : ""}
                        onClick={() => setOrderType("LIMIT")}
                    >
                        Limit Order
                    </button>
                </div>

                <div className="regular-order">
                    <div className="inputs">
                        <fieldset>
                            <legend>Qty.</legend>
                            <input
                                type="number"
                                name="qty"
                                id="qty"
                                min="1"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                            />
                        </fieldset>
                        <fieldset>
                            <legend>Price (₹)</legend>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                step="0.05"
                                min="0.05"
                                value={stockPrice}
                                onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
                            />
                        </fieldset>
                    </div>

                    {feedback && (
                        <div className={`order-feedback ${feedback.type}`}>
                            {feedback.message}
                        </div>
                    )}
                </div>

                <div className="buttons">
                    <span className="margin-text">
                        Margin required: <strong>₹{marginRequired}</strong>
                    </span>
                    <div className="action-buttons-group">
                        <button
                            type="button"
                            className={`btn ${isBuy ? 'btn-blue' : 'btn-red'}`}
                            onClick={handleOrderSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : mode}
                        </button>
                        <button
                            type="button"
                            className="btn btn-grey"
                            onClick={closeBuyWindow}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
