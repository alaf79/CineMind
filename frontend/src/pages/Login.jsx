import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser, registerUser } from "../api/auth";

export default function Login({ onLogin }) {
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.search.includes("signup"));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let res;

      if (isSignup) {
        res = await registerUser(form.username, form.email, form.password);
      } else {
        res = await loginUser(form.username, form.password);
      }

      if (!res.success) {
        setError(res.error || "Something went wrong");
        return;
      }

      localStorage.setItem("token", res.token);
      onLogin();
      navigate("/dashboard");

    } catch (err) {
      console.log("API_URL:", import.meta.env.VITE_API_URL);
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar loggedIn={false} hideLinks={true} />

      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h1>

          {error && (
            <p className="text-red-400 text-center mb-4">{error}</p>
          )}

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-700"
              required
            />

            {isSignup && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-gray-700"
                required
              />
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-md bg-gray-700"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4 text-center">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
