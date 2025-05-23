const express = require('express');
const router = express.Router();

// Homepage
router.get('/', (req, res) => {
    res.json({ title: 'Register' });
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

module.exports = router;
