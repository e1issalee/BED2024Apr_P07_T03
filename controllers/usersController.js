const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const getUserByEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.getUserByEmailAndPassword(email, password);
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in' });
  }
};

async function login(req, res) {
  const { email , password } = req.body;

  try {
    // Validate user credentials
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const createUser = async (req, res) => {
  const newUser = req.body;
  newUser.role = 'User';
  try {

    // Check for existing username
    const existingUser = await User.getUserByName(newUser.name);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const password = newUser.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser.password = hashedPassword;
    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

const updateUserPointsAndVouchers = async (req, res) => {
  
  const userId = parseInt(req.params.id);
  const { points, numberOfVouchers } = req.body;
  try {
    const updatedUser = await User.updateUserPointsAndVouchers(userId, points, numberOfVouchers);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const updateUserCalories = async (req, res) => {
  
  const userId = parseInt(req.params.id);
  const { dailyCalories } = req.body;
  try {
    const updatedUser = await User.updateUserCalories(userId, dailyCalories);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const resetUserCalories = async (req, res) => {
  
  const userId = parseInt(req.params.id);
  try {
    const updatedUser = await User.resetUserCalories(userId);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const getUsersWithVouchers = async (req, res) => {
  try {
      const users = await User.getUsersWithVouchers();
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with vouchers" });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

const getUserWithVouchersById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
      const user = await User.getUserWithVouchersById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user with vouchers" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmailAndPassword,
  login,
  createUser,
  updateUserPointsAndVouchers,
  updateUserCalories,
  resetUserCalories,
  getUsersWithVouchers,
  deleteUser,
  getUserWithVouchersById,
};