import React, { useState } from "react";
import "../style.css";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
function Signin() {
  const navigate = useNavigate();
  const [inpVal, setInpVal] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [tempPassword, setTempPassword] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  function onChangeInput(event) {
    setInpVal(event.target.value);
    setTempPassword("");
    setEmailExists(false);
    const value = event.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    setIsValid(
      value === "" || emailRegex.test(value) || phoneRegex.test(value),
    );
  }
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://netflix-login-backend-svpc.onrender.com";
    }
    return "http://localhost:5000";
  }
  async function handleContinue() {
     
    if (isValid && inpVal.trim()) {
      try{
      setLoading(true);
      setErrorMsg("");
      var serviceURL = getApiUrl();
      var response = await axios.post(`${serviceURL}/signup`, {
        creds: inpVal,
      });
      setInpVal("");
      if (response.data.status === true) {
        setEmailExists(true);
      } else {
        setTempPassword(response.data.tempPassword);
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    }
  }

  return (
      <div className="signin-container">
        <Header />
        <h1 className="signin-title">Enter your info to sign in</h1>
        <h3 className="signin-subtitle">Or get started with a new account.</h3>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Email or mobile number"
            value={inpVal}
            name="creds"
            className={`signin-input ${!isValid ? "invalid" : ""}`}
            onChange={onChangeInput}
          />
          {!isValid && (
            <p className="error-message">
              Please enter a valid email or mobile number.
            </p>
          )}
        </div>
          {errorMsg && <p className="error-message">{errorMsg}</p>}
        {tempPassword && (
          <div className="temp-password-section">
            <p>Your temporary password:</p>
            <strong>{tempPassword}</strong>
            <p>Use this to login and change your password.</p>
            <button
              className="continue-btn active"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
            
          </div>
        )}

        {/* Email already Exists Section */}
        {emailExists && (
          <div className="email-exists-section">
            <p>This account already exists. Please login.</p>

            <button
              className="continue-btn active"
              onClick={() => navigate("/login")}
            >
              Proceed to Login
            </button>
          </div>
        )}

        <button
          className={`continue-btn ${isValid && inpVal.trim() ? "active" : ""}`}
          onClick={handleContinue}
          disabled={!isValid || !inpVal.trim()||loading}
        >
          {loading ? <div className="loader"></div>:"Continue"}
        </button>
        {loading && <div className="loader-overlay"></div>}
        <div className="help-section">
          <h3>Get Help</h3>
          <p>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
          </p>
          <p>Learn more</p>
        </div>
      </div>
  );
}

export default Signin;
