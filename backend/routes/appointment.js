const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// 📌 Create an appointment
router.post('/create', authenticateToken, appointmentController.createAppointment);

// 📌 Get all appointments (for logged-in user)
router.get('/', authenticateToken, appointmentController.getAppointments);

// 📌 Edit appointment form
router.get('/edit/:id', authenticateToken, appointmentController.editAppointmentForm);

// 📌 Submit appointment update
router.post('/edit/:id', authenticateToken, appointmentController.updateAppointment);

// 📌 Delete appointment
router.post('/delete/:id', authenticateToken, appointmentController.deleteAppointment);

module.exports = router;