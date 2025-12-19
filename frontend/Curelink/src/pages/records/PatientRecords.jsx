import { useState, useEffect } from 'react';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';

export default function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await API.get('/records');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to load medical records', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Medical Records</h1>

        {loading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <EmptyState 
            title="No medical records found" 
            description="You don't have any medical records yet. They will appear here after your visits."
          />
        ) : (
          <div className="space-y-6">
            {records.map(record => (
              <div key={record._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By Dr. {record.doctorId.name} • {formatDate(record.visitDate)}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                    {record.doctorId.specialization}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Prescription</h4>
                    <p className="mt-1 text-gray-900">{record.prescription}</p>
                  </div>
                  {record.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                      <p className="mt-1 text-gray-900">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}