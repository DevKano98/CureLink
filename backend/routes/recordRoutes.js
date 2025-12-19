const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { createRecord, getPatientRecords } = require('../controllers/recordController');

const router = express.Router();

router.post('/', protect, authorizeRoles('doctor'), createRecord);
router.get('/', protect, authorizeRoles('patient'), getPatientRecords);

module.exports = router;