import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import "./styles.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="background-image-container">
      <div className="form_bg">
        <h2 className="text-align:center">Login</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage.includes("user") && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage.includes("password") && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <p className="mt-2">
            <Link to="/forgot-password" style={{color:"#4C2B21"}}>
              Forgot Password?
            </Link>
          </p>
        </form>
        <p>Don't Have an Account?</p>
        <Link to="/register" className="btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;