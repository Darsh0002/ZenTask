import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupWithOTP = () => {
  const { userLoggedIn } = useAuth();

  if (userLoggedIn) return <Navigate to="/dashboard" replace />;
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/otp/send?email=${encodeURIComponent(
          user.email
        )}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {
          message: response.statusText || "OTP Sent to email " + user.email,
        };
      }

      if (response.ok) {
        setStep(2);
        setMessage("✅ " + data.message);
        setResendTimer(30); // 30s cooldown for resend
      } else if (response.status === 409) {
        setMessage(
          <>
            Email is already registered.{" "}
            <a
              href="/login"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              Login here
            </a>
            .
          </>
        );
      } else {
        setMessage(`❌ ${data.message || "Error sending OTP"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp("");
    await requestOtp({ preventDefault: () => {} });
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const payload = { user, otp };

    try {
      const response = await fetch(`http://localhost:8080/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText };
      }

      if (response.ok) {
        setStep(3);
        setMessage("✅ " + data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (response.status === 409) {
        setMessage("❌ User already exists, please login");
      } else {
        setMessage(`❌ ${data.message || "Invalid OTP"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network Error, Try Again Later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          <div
            className={`font-bold ${
              step >= 1 ? "text-blue-600" : "text-gray-300"
            }`}
          >
            1. Sign Up
          </div>
          <div
            className={`font-bold ${
              step >= 2 ? "text-blue-600" : "text-gray-300"
            }`}
          >
            2. OTP
          </div>
          <div
            className={`font-bold ${
              step >= 3 ? "text-blue-600" : "text-gray-300"
            }`}
          >
            3. Done
          </div>
        </div>

        {/* Step 1: Sign Up */}
        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-4">
            {message && (
              <p className="text-center font-bold text-red-500">{message}</p>
            )}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={handleChange}
                required
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                required
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                required
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <div
                className="absolute top-3 right-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
            <p className="text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            {message && <p className="text-center text-green-500">{message}</p>}
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={resendOtp}
                className={`py-2 px-4 rounded-lg border ${
                  resendTimer > 0
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-500 border-blue-500 hover:bg-blue-50"
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-4 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Signup Successful!
            </h2>
            <p>Redirecting you to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupWithOTP;
