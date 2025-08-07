import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import "./styles.css";

const Home = () => {
  const [sheets, setSheets] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/dropdown");
        setSheets(response.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };
    fetchDropdownOptions();
  }, []);

  const handlelogout = () => {
    navigate('/login');
  };

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!courseName) validationErrors.courseName = "Course title is required.";
    if (!selectedSheet) validationErrors.selectedSheet = "Please select a department.";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const response = await axios.post("http://127.0.0.1:3001/generatecode", {
        courseName,
        selectedSheet,
      });
      
      const { newCode, existingCode, message } = response.data;
      
      if (message === "Course code already generated") {
        setGeneratedCode(existingCode);
        setMessage("This course code has already been generated.");
      } else {
        setGeneratedCode(newCode);
        setMessage("");
      }
      
      setCourseName("");
      setSelectedSheet("");
      setErrors({});
    } catch (error) {
      console.error("Error generating code:", error);
      setMessage("An error occurred while generating the code.");
    }
  };

  return (
    <div className="background-image-container">
      <div className="form_bg">
        <div className="header-container">
          <h1>Course Code Generator</h1>
          <button onClick={handlelogout} className="btn logout-btn">Logout</button>
        </div>
        
        <input
          type="text"
          placeholder="Enter Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="form-control"
        />
        {errors.courseName && <p style={{ color: "red" }}>{errors.courseName}</p>}
        
        <br />
        
        <select
          value={selectedSheet}
          onChange={(e) => setSelectedSheet(e.target.value)}
          className="form-select"
        >
          <option value="" disabled>-- Select Department --</option>
          {sheets.map((sheet) => (
            <option key={sheet} value={sheet}>{sheet}</option>
          ))}
        </select>
        {errors.selectedSheet && <p style={{ color: "red" }}>{errors.selectedSheet}</p>}
        
        <br />
        
        <button onClick={handleGenerateCode} className="btn">Generate Code</button>
        
        {message && <p style={{ color: "red" }}>{message}</p>}
        
        {generatedCode && (
          <div className="generated-code">
            <p><strong>Generated Code:</strong> {generatedCode}</p>
          </div>
        )}
        
        <br />
        <Link to="/course-codes" className="btn">See All Generated Codes</Link>
      </div>
    </div>
  );
};

export default Home;