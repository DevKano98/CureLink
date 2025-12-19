const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  getAllUsers,
  toggleUserStatus,
  addDoctor,
  getAllAppointments
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.patch('/users/:id/toggle', protect, authorizeRoles('admin'), toggleUserStatus);
router.post('/doctors', protect, authorizeRoles('admin'), addDoctor);
router.get('/appointments', protect, authorizeRoles('admin'), getAllAppointments);

module.exports = router;