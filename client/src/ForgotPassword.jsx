import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles.css";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/verify-email', { email });
      if (response.data.success) {
        setEmailVerified(true);
        setMessage("Email verified! Enter your new password.");
      } else {
        setMessage(response.data.error);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/reset-password', { email, newPassword });
      setMessage(response.data.message);
      navigate('/login'); 
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="background-image-container">
      <div className="form_bg">
        <h2>Forgot Password</h2>
        <br />
        {!emailVerified ? (
          <form onSubmit={handleVerifyEmail}>
            <div className="mb-3">
              <label><strong>Enter Your Email</strong></label>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                className="form-control rounded-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Verify Email</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label><strong>Enter New Password</strong></label>
              <input
                type="password"
                placeholder="Enter new password"
                className="form-control rounded-0"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Reset Password</button>
          </form>
        )}
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;