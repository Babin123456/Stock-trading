import { Schema } from "mongoose";

export const OrderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },
        qty: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"]
        },
        price: {
            type: Number,
            required: true,
            min: [0.01, "Price must be positive"]
        },
        mode: {
            type: String,
            required: true,
            enum: ["BUY", "SELL"],
            uppercase: true
        },
        orderType: {
            type: String,
            enum: ["MARKET", "LIMIT"],
            default: "MARKET"
        },
        status: {
            type: String,
            enum: ["COMPLETED", "REJECTED", "PENDING"],
            default: "COMPLETED"
        },
        reason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);
