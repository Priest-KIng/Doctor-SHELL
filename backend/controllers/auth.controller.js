import { generateToken } from "../lib/utils.js"; // Assuming this is your JWT generation function
import bcrypt from "bcryptjs";
import Doctor from "../models/doctor.model.js"; // Assuming you have a separate Doctor model
import User from "../models/user.model.js"; // User model for regular users

// Doctor signup
export const doctorSignup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Input validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email exists
    const doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ message: "Email already exists" });

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new doctor
    const newDoctor = new Doctor({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the doctor
    await newDoctor.save();

    // Generate JWT token
    generateToken(newDoctor._id, res);

    // Return doctor data
    res.status(200).json({
      _id: newDoctor._id,
      fullName: newDoctor.fullName,
      email: newDoctor.email,
      profilePic: newDoctor.profilePic || null, // Add this to the Doctor model if needed
    });
  } catch (error) {
    console.log("Error in doctor signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User signup
export const userSignup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Input validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    generateToken(newUser._id, res);

    // Return user data
    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error in user signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login route (to be implemented)
export const login = async (req, res) => {
  res.send("Login route");
};

// Logout route (to be implemented)
export const logout = async (req, res) => {
  res.send("Logout route");
};
