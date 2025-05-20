const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const userController = {
  // Register a new user
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        email,
        password,
        name
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching profile' });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'profilePicture'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
      updates.forEach(update => req.user[update] = req.body[update]);
      await req.user.save();
      res.json(req.user);
    } catch (error) {
      res.status(400).json({ error: 'Error updating profile' });
    }
  },

  // Delete user account
  async deleteAccount(req, res) {
    try {
      await req.user.remove();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting account' });
    }
  }
};

module.exports = userController; 