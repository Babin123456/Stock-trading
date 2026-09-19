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
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedpassword,
            username
        })
        await newUser.save();

        return res.status(200).json({ message: "Registration is Successful, please loggedIn", newUser });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "all feilds are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not registerd" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("password", user.password);
        console.log("password", password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "user logged in"
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });

    }
});

router.post("/logout", (req, res) => {

    res.clearCookie("token");

    res.status(200).json({
        message: "Logged out successfully"
    });

});

router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

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