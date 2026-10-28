import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
import clientServer from "../../clientServer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });

    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-left",
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            handleError("Please enter both email and password");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await clientServer.post("/login", {
                email: email.trim(),
                password
            });

            const { message } = res.data;
            handleSuccess(message || "Login successful!");

            const targetDashboard = import.meta.env.VITE_DASHBOARD_URL || "https://dashboard-theta-one-42.vercel.app";
            setTimeout(() => {
                window.location.href = targetDashboard;
            }, 1500);
        } catch (error) {
            console.error("Login error:", error);
            const errMsg = error.response?.data?.message || "Invalid email or password. Please try again.";
            handleError(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="CardContainer">
            <h2>Login Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="login-email">Email</label>
                    <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="login-password">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <span>
                    Don't have an account? <Link to={"/signup"}>Sign up</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
