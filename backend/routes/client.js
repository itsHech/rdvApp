const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, clientController.getClients);

module.exports = router;