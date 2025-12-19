const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true, trim: true },
  prescription: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
  visitDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);