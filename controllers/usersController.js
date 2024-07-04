const User = require("../models/user");

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

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
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
module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmailAndPassword,
  createUser,
  updateUserPointsAndVouchers,
  deleteUser,
};