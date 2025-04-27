const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, professionalController.getProfessionals);

module.exports = router;