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

        const trimmedUsername = typeof username === "string" ? username.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";

        if (trimmedUsername.length < 2) {
            return res.status(400).json({ message: "Username must be at least 2 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        // Enforce backend password validation (minimum 6 characters)
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existUser = await User.findOne({ email: normalizedEmail });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: normalizedEmail,
            password: hashedpassword,
            username: trimmedUsername
        });
        await newUser.save();

        return res.status(200).json({
            message: "Registration is successful, please log in",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
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

        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
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

        // Environment-specific cookie configuration
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
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
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
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
