const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

const createRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes, visitDate } = req.body;
    const doctorId = req.user._id;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId,
      diagnosis,
      prescription,
      notes,
      visitDate: new Date(visitDate)
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create medical record' });
  }
};

const getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical records' });
  }
};

module.exports = { createRecord, getPatientRecords };