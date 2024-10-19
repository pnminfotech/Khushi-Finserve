const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', authUser);

module.exports = router;
