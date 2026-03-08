import React, { useState } from "react";
import "../style.css";
import axios from "axios";
function Signin() {
  const [inpVal, setInpVal] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [tempPassword, setTempPassword] = useState("");
  const [emailExists, setEmailExists] = useState(false);
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

  function handleContinue() {
    if (isValid && inpVal.trim()) {
      // alert("Continue clicked!");
      var logindetails = axios.post("http://localhost:5000/signup", {
        creds: inpVal
      });
      logindetails.then(function(succ){
        setInpVal("");
        if (succ.data.status === true) {
          setEmailExists(true);
        } else {
          setTempPassword(succ.data.tempPassword);
        }
      })
    }
  }

  return (
    <div className="signin-container">
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

      {tempPassword && (
        <div className="temp-password-section">
          <p>Your temporary password:</p>
          <strong>{tempPassword}</strong>
          <p>Use this to login and change your password.</p>
        </div>
      )}

      {/* Email Already Exists Section */}
      {emailExists && (
        <div className="email-exists-section">
          <p>This account is already generated temporary password. Please login.</p>
        </div>
      )}

      <button
        className={`continue-btn ${isValid && inpVal.trim() ? "active" : ""}`}
        onClick={handleContinue}
        disabled={!isValid || !inpVal.trim()}
      >
        Continue
      </button>

      <div className="help-section">
        <h3>Get Help</h3>
        <p>
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
        <p>Learn more</p>
      </div>
    </div>
  );
}

export default Signin;
