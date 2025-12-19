import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState({
    doctors: true,
    slots: false,
    booking: false
  });
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // doctor fetch karne ko
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(prev => ({ ...prev, doctors: true }));
        const res = await API.get('/appointments/doctors');
        
        const doctorsArray = Array.isArray(res.data) ? res.data : res.data.doctors || [];
        
        if (doctorsArray.length === 0) {
          setError('No doctors available');
          setToast({ message: 'No doctors available', type: 'info' });
        } else {
          setDoctors(doctorsArray);
          setError(null);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load doctors';
        setError(errorMsg);
        setToast({ message: errorMsg, type: 'error' });
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };
    fetchDoctors();
  }, []);

 //available slots fetch karne ko
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDoctor && selectedDate) {
        setLoading(prev => ({ ...prev, slots: true }));
        try {
          const res = await API.get('/appointments/slots', {
            params: { doctorId: selectedDoctor._id, date: selectedDate }
          });
          
          const slotsArray = Array.isArray(res.data) ? res.data : res.data.slots || [];
          setAvailableSlots(slotsArray);
          setSelectedSlot('');
        } catch (err) {
          setToast({ message: 'Failed to load slots', type: 'error' });
          setAvailableSlots([]);
        } finally {
          setLoading(prev => ({ ...prev, slots: false }));
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setToast({ message: 'Please select doctor, date and time', type: 'error' });
      return;
    }

    setLoading(prev => ({ ...prev, booking: true }));
    try {
      await API.post('/appointments/book', {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        timeSlot: selectedSlot
      });
      setToast({ message: 'Appointment booked!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <RoleGuard allowedRoles={['patient']}>
      <div className="py-6 px-4 max-w-6xl mx-auto">
        <div className="absolute top-4 right-4">
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Doctor</h2>

        {error && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
            {error}
          </div>
        )}

        {loading.doctors ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {doctors.map(doctor => (
              <div
                key={doctor._id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-3 rounded border cursor-pointer transition ${
                  selectedDoctor?._id === doctor._id
                    ? 'border-gray-800 bg-gray-100'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">Dr. {doctor.name}</p>
                <p className="text-xs text-gray-600 mt-1">{doctor.specialization}</p>
                {doctor.experience && (
                  <p className="text-xs text-gray-500 mt-1">{doctor.experience} yrs</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-600">No doctors available</div>
        )}

        {selectedDoctor && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-semibold">Dr. {selectedDoctor.name}</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={today}
                    max={maxDateStr}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot *
                  </label>
                  {selectedDate ? (
                    loading.slots ? (
                      <div className="py-2">
                        <LoadingSpinner />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                        required
                      >
                        <option value="">-- Select time --</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-gray-500 py-2">No slots available</p>
                    )
                  ) : (
                    <p className="text-xs text-gray-500 py-2">Select date first</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading.booking || !selectedDate || !selectedSlot}
                className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading.booking ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}