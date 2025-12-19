const User = require('../models/User');
const Appointment = require('../models/Appointment');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed ' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User nhi haii' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update' });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    const doctor = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      specialization
    });
    res.status(201).json(doctor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email pehle se haii' });
    }
    res.status(500).json({ message: 'Doctor add nhi hua' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'appointments fetch nhi hue' });
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  addDoctor,
  getAllAppointments
};