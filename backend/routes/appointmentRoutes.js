const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  getDoctors,
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/doctors', protect, authorizeRoles('patient'), getDoctors);
router.get('/slots', protect, authorizeRoles('patient'), getAvailableSlots);
router.post('/book', protect, authorizeRoles('patient'), bookAppointment);
router.get('/', protect, getAppointments);
router.patch('/:id/status', protect, authorizeRoles('doctor'), updateAppointmentStatus);

module.exports = router;