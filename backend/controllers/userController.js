const User = require('../models/User');

const getActivePatients = async (req, res) => {
  try {
    const patients = await User.find({ 
      role: 'patient', 
      isActive: true 
    }).select('name email');
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
};

module.exports = { getActivePatients };