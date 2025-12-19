import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

export default function CreateRecord() {
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    visitDate: ''
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Fetch active patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await API.get('/patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setToast({ message: 'Could not load patient list. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      setToast({ message: 'Please select a patient', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/records', formData);
      setToast({ message: 'Medical record created successfully', type: 'success' });
      // Small delay to show the success message before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Record creation error:', err);
      setToast({ message: err.response?.data?.message || 'Failed to save record', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['doctor']}>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="absolute top-4 right-4">
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Medical Record</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Patient *
              </label>
              {loading ? (
                <div className="py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">-- Choose a patient --</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis *
              </label>
              <textarea
                name="diagnosis"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.diagnosis}
                onChange={handleChange}
                required
                placeholder="e.g., Hypertension, Type 2 Diabetes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescription *
              </label>
              <textarea
                name="prescription"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.prescription}
                onChange={handleChange}
                required
                placeholder="e.g., Amlodipine 5mg once daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional observations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Date *
              </label>
              <input
                type="date"
                name="visitDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.visitDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
              >
                {submitting ? 'Saving...' : 'Save Medical Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}