const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// 📌 Create an appointment
router.post('/create', authenticateToken, appointmentController.createAppointment);

// 📌 Get all appointments (for logged-in user)
router.get('/', authenticateToken, appointmentController.getAppointments);

// 📌 Get all appointments (for logged-in user)
router.get('/all', authenticateToken, appointmentController.getAllAppointments);

// 📌 Submit appointment update
router.post('/edit/:id', authenticateToken, appointmentController.updateAppointment);

// 📌 Delete appointment
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

module.exports = router;