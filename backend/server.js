import express from "express";
import path from "path";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import { holdingsModels } from "./model/HoldingsModel.js";
import { PositionModel } from "./model/PositionsModel.js";
import { OrderModel } from "./model/OrderModel.js";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const mongodb = process.env.MONGO_URL;
import cookieParser from "cookie-parser";

if (mongodb) {
    mongoose
        .connect(mongodb)
        .then(() => console.log("Connected to MongoDB successfully"))
        .catch((err) => console.error("MongoDB connection error:", err.message));
} else {
    console.warn("MONGO_URL is not defined in environment variables");
}

app.get("/", async (req, res) => {
    res.send("Stock Trading API is running");
});

const defaultOrigins = [
    "https://dashboard-theta-one-42.vercel.app",
    "https://stock-trading-nwil.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : defaultOrigins;

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin) || defaultOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true
    })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(userRoutes);

// Database seed endpoints for initial testing (commented out by default)
// app.get("/addTodatabase", async (req, res) => {
//     let tempHoldings = [
//         { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
//         { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" }
//     ];
//     ...
// });

app.get("/allHoldings", async (req, res) => {
    try {
        const allholdings = await holdingsModels.find({});
        res.status(200).json(allholdings);
    } catch (err) {
        console.error("Error fetching holdings:", err.message);
        res.status(500).json({ message: "Failed to fetch holdings", error: err.message });
    }
});

app.get("/allPositions", async (req, res) => {
    try {
        const allpositions = await PositionModel.find({});
        res.status(200).json(allpositions);
    } catch (err) {
        console.error("Error fetching positions:", err.message);
        res.status(500).json({ message: "Failed to fetch positions", error: err.message });
    }
});

app.get("/allOrders", async (req, res) => {
    try {
        const allOrders = await OrderModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(allOrders);
    } catch (err) {
        console.error("Error fetching orders:", err.message);
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
});

app.post("/newOrder", async (req, res) => {
    try {
        const { name, qty, price, mode, orderType } = req.body;

        if (!name || !qty || !price || !mode) {
            return res.status(400).json({
                message: "Missing required order fields: name, qty, price, and mode are required"
            });
        }

        const parsedQty = Number(qty);
        const parsedPrice = Number(price);
        const normalizedMode = String(mode).toUpperCase();
        const cleanName = String(name).trim().toUpperCase();

        if (isNaN(parsedQty) || parsedQty <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }

        if (!["BUY", "SELL"].includes(normalizedMode)) {
            return res.status(400).json({ message: "Order mode must be either BUY or SELL" });
        }

        if (normalizedMode === "BUY") {
            const existingHolding = await holdingsModels.findOne({ name: cleanName });

            if (existingHolding) {
                const currentQty = existingHolding.qty;
                const currentAvg = existingHolding.avg;
                const newTotalQty = currentQty + parsedQty;
                const newAvgPrice = ((currentQty * currentAvg) + (parsedQty * parsedPrice)) / newTotalQty;
                const netPercent = (((parsedPrice - newAvgPrice) / newAvgPrice) * 100).toFixed(2);

                existingHolding.qty = newTotalQty;
                existingHolding.avg = Number(newAvgPrice.toFixed(2));
                existingHolding.price = parsedPrice;
                existingHolding.net = netPercent >= 0 ? `+${netPercent}%` : `${netPercent}%`;
                await existingHolding.save();
            } else {
                const newHolding = new holdingsModels({
                    name: cleanName,
                    qty: parsedQty,
                    avg: parsedPrice,
                    price: parsedPrice,
                    net: "+0.00%",
                    day: "+0.00%"
                });
                await newHolding.save();
            }

            const newOrder = new OrderModel({
                name: cleanName,
                qty: parsedQty,
                price: parsedPrice,
                mode: "BUY",
                orderType: orderType || "MARKET",
                status: "COMPLETED"
            });
            await newOrder.save();

            return res.status(201).json({
                message: "Buy order executed successfully and portfolio updated",
                order: newOrder
            });
        } else if (normalizedMode === "SELL") {
            const existingHolding = await holdingsModels.findOne({ name: cleanName });

            if (!existingHolding || existingHolding.qty < parsedQty) {
                const availableQty = existingHolding ? existingHolding.qty : 0;
                const rejectedOrder = new OrderModel({
                    name: cleanName,
                    qty: parsedQty,
                    price: parsedPrice,
                    mode: "SELL",
                    orderType: orderType || "MARKET",
                    status: "REJECTED",
                    reason: `Insufficient holdings. Available: ${availableQty}, Requested: ${parsedQty}`
                });
                await rejectedOrder.save();

                return res.status(400).json({
                    message: `Sell order rejected: Insufficient holdings (Available: ${availableQty}, Requested: ${parsedQty})`,
                    order: rejectedOrder
                });
            }

            if (existingHolding.qty === parsedQty) {
                await holdingsModels.deleteOne({ _id: existingHolding._id });
            } else {
                existingHolding.qty -= parsedQty;
                existingHolding.price = parsedPrice;
                const netPercent = (((parsedPrice - existingHolding.avg) / existingHolding.avg) * 100).toFixed(2);
                existingHolding.net = netPercent >= 0 ? `+${netPercent}%` : `${netPercent}%`;
                await existingHolding.save();
            }

            const newOrder = new OrderModel({
                name: cleanName,
                qty: parsedQty,
                price: parsedPrice,
                mode: "SELL",
                orderType: orderType || "MARKET",
                status: "COMPLETED"
            });
            await newOrder.save();

            return res.status(201).json({
                message: "Sell order executed successfully and holdings deducted",
                order: newOrder
            });
        }
    } catch (err) {
        console.error("Error executing order:", err);
        return res.status(500).json({
            message: "Internal server error while executing order",
            error: err.message
        });
    }
});

app.get("/home", async (req, res) => {
    res.send("server is Listening");
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
