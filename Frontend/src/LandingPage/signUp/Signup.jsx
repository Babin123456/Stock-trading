import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
import clientServer from "../../clientServer.js";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !username.trim() || !password) {
      handleError("All fields are required");
      return;
    }

    if (password.length < 6) {
      handleError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await clientServer.post("/register", {
        username: username.trim(),
        email: email.trim(),
        password
      });

      const { message } = res.data;
      handleSuccess(message || "Registration successful! Please log in.");

      setEmail("");
      setPassword("");
      setUserName("");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error("Signup error:", error);
      const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
      handleError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="CardContainer">
      <h2>Signup Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={email}
            placeholder="Enter your email"
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-username">Username</label>
          <input
            type="text"
            id="signup-username"
            name="username"
            value={username}
            placeholder="Enter your username"
            autoComplete="username"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            name="password"
            value={password}
            placeholder="Enter your password (min 6 characters)"
            autoComplete="new-password"
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
