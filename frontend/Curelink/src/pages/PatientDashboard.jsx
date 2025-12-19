import { useState, useEffect } from 'react';
import API from '../services/api';
import RoleGuard from '../components/RoleGuard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import EmptyState from '../components/EmptyState';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get('/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const upcoming = appointments.filter(a => 
    new Date(a.date) >= new Date() && a.status === 'booked'
  );
  const past = appointments.filter(a => 
    new Date(a.date) < new Date()
  );

  return (
    <RoleGuard allowedRoles={['patient']}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
        <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
                  <div className="flex space-x-3">
                    <a 
                      href="/records" 
                      className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                    >
                      View Medical Records
                    </a>
                    <a 
                      href="/appointments/book" 
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                    >
                      + Book Appointment
                    </a>
                  </div>
                </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
              {upcoming.length === 0 ? (
                <EmptyState 
                  title="No upcoming appointments" 
                  description="You don't have any upcoming appointments. Book one now to see it here."
                />
              ) : (
                <ul className="space-y-4">
                  {upcoming.map((apt) => (
                    <li key={apt._id} className="border-l-4 border-primary-500 pl-4 py-3 bg-white rounded-r-lg shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{new Date(apt.date).toDateString()}</p>
                          <p className="text-sm text-gray-600">{apt.timeSlot} • {apt.doctorId.name}</p>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                          {apt.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Past Appointments */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Past Appointments</h2>
              {past.length === 0 ? (
                <EmptyState 
                  title="No past appointments" 
                  description="Your past appointments will appear here after your visit."
                />
              ) : (
                <ul className="space-y-4">
                  {past.map((apt) => (
                    <li key={apt._id} className="border-l-4 border-gray-300 pl-4 py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{new Date(apt.date).toDateString()}</p>
                          <p className="text-sm text-gray-600">{apt.timeSlot} • {apt.doctorId.name}</p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          apt.status === 'completed' 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-danger-100 text-danger-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}