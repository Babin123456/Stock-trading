import express from "express";
const router = express.Router();
import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import { authenticateUser } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existUser = await User.findOne({ email: normalizedEmail });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: normalizedEmail,
            password: hashedpassword,
            username: username.trim()
        });
        await newUser.save();

        return res.status(200).json({ message: "Registration is successful, please log in", newUser });
    } catch (err) {
        console.error("Registration error:", err.message);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET || "default_jwt_secret_dev",
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err.message);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
});

router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;
