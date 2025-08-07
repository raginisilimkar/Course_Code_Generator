import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  //Email valid
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!name) validationErrors.name = "Name is required.";
    if (!email) validationErrors.email = "Email is required.";
    else if (!isEmailValid(email)) validationErrors.email = "Invalid email format.";
    if (!password) validationErrors.password = "Password is required.";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    //fetch data from register api
    try {
      await axios.post("/axios/register", { name, email, password });
      navigate("/login"); 
    } catch (error) {     
      setErrors({ general: error.response?.data?.error || "Registration failed. Try again." });
    }
  };

  return (
    <div className="background-image-container">
      <div className="form_bg">
        <h2>Sign Up</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Name</strong></label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control rounded-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </div>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <p>Already Have an Account?</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;