import { useState, useEffect } from 'react';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get('/admin/appointments');
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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <RoleGuard allowedRoles={['admin']}>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h1>

        {loading ? (
          <LoadingSpinner />
        ) : appointments.length === 0 ? (
          <EmptyState 
            title="No appointments found" 
            description="There are no appointments in the system yet."
          />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.patientId.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Dr. {apt.doctorId.name} ({apt.doctorId.specialization})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(apt.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apt.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        apt.status === 'completed' ? 'bg-success-100 text-success-800' :
                        apt.status === 'cancelled' ? 'bg-danger-100 text-danger-800' :
                        'bg-warning-100 text-warning-800'
                      }`}>
                        {apt.status}
                      </span>
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