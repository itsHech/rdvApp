const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, professionalController.createProfessional);
router.get('/', authenticateToken, professionalController.getProfessionals);
router.get('/:id', authenticateToken, professionalController.getProfessionalById);

module.exports = router;