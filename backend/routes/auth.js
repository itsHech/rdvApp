const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

// Show Register Page
router.get('/register', (req, res) => {
    res.json({ title: 'Register' });
});

// Handle Register
router.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], userController.registerUser);

// Show Login Page
router.get('/login', userController.showLoginPage);

// Handle Login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').not().isEmpty().withMessage('Password is required')
], userController.loginUser);

// Get current authenticated user
router.get('/me', userController.authenticateToken, userController.getAuthenticatedUser);

module.exports = router;
