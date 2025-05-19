const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust path if needed
const { protect } = require('../middleware/auth'); // Adjust path if needed

// ... existing user routes (e.g., profile update, password update) ...

// Delete user account
router.delete('/account', protect, userController.deleteAccount);

module.exports = router;