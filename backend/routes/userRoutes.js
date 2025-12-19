const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { getActivePatients } = require('../controllers/userController');

const router = express.Router();

router.get('/patients', protect, authorizeRoles('doctor'), getActivePatients);

module.exports = router;