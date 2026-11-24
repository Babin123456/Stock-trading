import { OrderModel } from "../model/OrderModel.js";
import { holdingsModels } from "../model/HoldingsModel.js";

export const createOrder = async (req, res) => {
    try {
        const { name, qty, price, mode, orderType } = req.body;

        if (!name || qty === undefined || price === undefined || !mode) {
            return res.status(400).json({ message: "All fields (name, qty, price, mode) are required" });
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
};

export const getAllOrders = async (req, res) => {
    try {
        const allOrders = await OrderModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json(allOrders);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch orders",
            error: err.message
        });
    }
};
