import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./signup.css";
import clientServer from "../../clientServer";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        try {
            const res = await clientServer.post("/login",
                {
                    email, password
                },

            );

            const { message } = res.data;
            const status = res.status
            if (status == 200) {
                handleSuccess(message);
                setTimeout(() => {
                    window.location.href = "https://dashboard-theta-one-42.vercel.app";
                }, 2000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className="CardContainer">
            <h2>Login Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                <span>
                    Already have an account? <Link to={"/signup"}>Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;