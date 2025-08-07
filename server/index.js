// To connect to database
// mongosh --port 27017




const dotenv = require('dotenv');
dotenv.config(); 
const bodyParser = require('body-parser');
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")

const fs = require('fs');
const UserModel =require('./models/Users')
const Course =require('./models/Course')


const app = express()
app.use(express.json())
app.use(cors());

//connecting to mongodb
mongoose.connect(process.env.MONGO_URI);
// 

//Signup
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const newUser = await UserModel.create({ name, email, password });
    res.status(201).json({ success: true, message: "Registration successful." });
  } catch (err) {
    res.status(500).json({ error: "Error registering user." });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Enter Email of user exists." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "password Required." });
    }

    res.json({ success: true, message: "Login successful." });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//Email verification for password reset
app.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
      return res.status(400).json({ success: false, error: "Email not found" });
  }

  res.json({ success: true, message: "Email verified successfully" });
});


//reset password
app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ success: false, error: "User not found" });
    }

    
    const Pwd = newPassword;
    user.password = Pwd;

  
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully!" });
});


//dropdown
app.get("/dropdown", async (req, res) => {
  try {
    const options = ["SCT","ENG","ECO","ACC",                      
      "IKS","MATH","LAW","COM","EVS","CC"];
    res.json(options);
  } catch (error) {
    res.status(500).send("Error fetching dropdown options");
  }
});
  


//main  Coursegenerate logic
app.post("/generatecode", async (req, res) => {
  const { courseName, selectedSheet } = req.body;

  if (!courseName || !selectedSheet) {
    return res.status(400).send("Course title and dropdown value are required.");
  }

  try {
 
    const existingCourse = await Course.findOne({
      courseName,
      courseCode: { $regex: `^MCC${selectedSheet}`, $options: "i" }
    });

    if (existingCourse) {
      return res.json({
        message: "Course code already generated",
        existingCode: existingCourse.courseCode
      });
    }

    
    const existingCourses = await Course.find({
      courseCode: { $regex: `^MCC${selectedSheet}`, $options: "i" }
    });

    console.log("Selected Sheet:", selectedSheet);
    console.log("Regex Used:", `MCC${selectedSheet}`);
    console.log("Existing Courses:", existingCourses);

    let highestCode = 101; 
    existingCourses.forEach((course) => {
      const match = course.courseCode.match(/(\d+)$/);
      if (match) {
        const codeNumber = parseInt(match[1], 10);
        if (codeNumber > highestCode) {
          highestCode = codeNumber;
        }
      }
    });


    
    const newCode = `MCC${selectedSheet}${highestCode + 1}`;
    console.log("Generated Code:", newCode);

    const newCourse = new Course({ courseName, courseCode: newCode });
    await newCourse.save();
    
    res.json({ newCode });

  } catch (error) {
    console.error("Error in /generatecode:", error);
    res.status(500).send("Error generating code");
  }
});


//Selecting course
app.get("/get-courses", async (req, res) => {
  try {
      const courses = await Course.find({});
      let groupedCourses = {};

      courses.forEach(course => {
          const { section, courseName, courseCode } = course;
          if (!groupedCourses[section]) {
              groupedCourses[section] = [];
          }
          groupedCourses[section].push({ courseName, courseCode });
      });

      res.json(groupedCourses);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch course codes." });
  }
});

app.listen(3001, ()=>{
  console.log("Server is running")
})




