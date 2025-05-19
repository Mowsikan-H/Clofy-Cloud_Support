const User = require('../models/User'); // Adjust the path if necessary

// Assuming you have other controller functions here...

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    // req.user is available because the route will be protected by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove the user
    await user.deleteOne(); // Use deleteOne()

    res.status(200).json({
      success: true,
      data: {} // Or a success message
    });

  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ... existing controller functions ...