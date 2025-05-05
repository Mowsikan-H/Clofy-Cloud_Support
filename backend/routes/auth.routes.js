const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aiCredits: user.aiCredits,
        engineerTickets: user.engineerTickets
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login user - TEMPORARY TEST VERSION
router.post('/login-test', async (req, res) => {
  try {
    // For testing only
    const user = await User.findOne().select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'No users in database' });
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login test error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Your account is not active' });
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aiCredits: user.aiCredits,
        engineerTickets: user.engineerTickets
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aiCredits: user.aiCredits,
        engineerTickets: user.engineerTickets,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;