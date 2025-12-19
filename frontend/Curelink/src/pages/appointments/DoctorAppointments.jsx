import { useState, useEffect } from 'react';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';

export default function DoctorAppointments() {
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
        setToast({ message: 'Failed to load appointments', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      setToast({ message: `Appointment ${status} successfully`, type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update appointment', type: 'error' });
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <RoleGuard allowedRoles={['doctor']}>
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
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
          >
            Back to Dashboard
          </a>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : appointments.length === 0 ? (
          <EmptyState 
            title="No appointments found" 
            description="You don't have any appointments scheduled yet."
          />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{apt.patientId.name}</div>
                      <div className="text-sm text-gray-500">{apt.patientId.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(apt.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        apt.status === 'completed' ? 'bg-success-100 text-success-800' :
                        apt.status === 'cancelled' ? 'bg-danger-100 text-danger-800' :
                        'bg-primary-100 text-primary-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {apt.status === 'booked' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(apt._id, 'completed')}
                            className="px-3 py-1 text-sm font-medium rounded-md text-success-600 hover:text-success-700 hover:bg-success-50 mr-3 transition duration-150 ease-in-out"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                            className="px-3 py-1 text-sm font-medium rounded-md text-danger-600 hover:text-danger-700 hover:bg-danger-50 transition duration-150 ease-in-out"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}