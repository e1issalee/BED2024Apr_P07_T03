const User = require("../models/user");
const validateUser = require("../middlewares/validateUser")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Joi = require("joi");

const getAllUsers = async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
  };
  
  const getUserByUsername = async (req, res) => {
    const userUsername = parseInt(req.params.username);
    try {
      const user = await User.getUserById(userUsername);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
  };

  const registerUser = async (req, res) => {
    const { username, passwordHash, role } = req.body;
    
    try {
        // Validate user data
        validateUser(username, passwordHash, role);

        // Check for existing username
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordHash, salt);

        // Create user in database
        await registerUser(username, hashedPassword, role)

        return res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

  async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      // Validate user credentials
      validateUser(username, password);

      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password with hash
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const payload = {
        user_id: user.user_id,
        role: user.role,
      };
      const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour
  
      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  module.exports = {
    getAllUsers,
    getUserByUsername,
    registerUser,
    login,
  };