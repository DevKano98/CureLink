const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true })
      .select('name email specialization');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Doctor fetch nhi hua' });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date chahiye' });
    }

    const bookedSlots = await Appointment.find({
      doctorId,
      date: new Date(date),
      status: { $ne: 'cancelled' }
    }).distinct('timeSlot');

    const allSlots = [];
    for (let hour = 9; hour <= 16; hour++) {
      allSlots.push(`${hour}:00-${hour}:30`);
      allSlots.push(`${hour}:30-${hour + 1}:00`);
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Available slots fetch nhi hua' });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user._id;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot
    });

    // Send email
    await sendEmail(
      req.user.email,
      'Appointment Booked – CureLink',
      `Your appointment with Dr. ${doctor.name} is confirmed on ${new Date(date).toDateString()} at ${timeSlot}.`
    );

    res.status(201).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Time slot pehle se book haii' });
    }
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { role } = req.user;
    let filter = {};

    if (role === 'patient') {
      filter.patientId = req.user._id;
    } else if (role === 'doctor') {
      filter.doctorId = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'apponitment fetch nhi hua' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['booked', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'doctor' || appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    if (status === 'completed') {
      const patient = await User.findById(appointment.patientId);
      await sendEmail(
        patient.email,
        'Appointment Completed – CureLink',
        `Your appointment with Dr. ${appointment.doctorId.name} has been marked as completed.`
      );
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

module.exports = {
  getDoctors,
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  updateAppointmentStatus
};