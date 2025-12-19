import { useState, useEffect } from 'react';
import API from '../../services/api';
import RoleGuard from '../../components/RoleGuard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import EmptyState from '../../components/EmptyState';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: 'TempPass123!',
    specialization: ''
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(`/admin/users/${id}/toggle`);
      fetchUsers(); // refresh
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update user status', type: 'error' });
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/doctors', newDoctor);
      setToast({ message: 'Doctor added successfully', type: 'success' });
      setAddingDoctor(false);
      setNewDoctor({ name: '', email: '', specialization: '' });
      fetchUsers();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add doctor', type: 'error' });
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <button
            onClick={() => setAddingDoctor(!addingDoctor)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
          >
            {addingDoctor ? 'Cancel' : '+ Add Doctor'}
          </button>
        </div>

        {addingDoctor && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Doctor</h2>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Specialization"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                required
              />
              <button
                type="submit"
                className="w-full bg-success-600 text-white py-2 rounded-lg hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
              >
                Add Doctor
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <EmptyState 
            title="No users found" 
            description="There are no users in the system yet."
          />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'doctor' ? 'bg-primary-100 text-primary-800' :
                        'bg-success-100 text-success-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(user._id)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          user.isActive ? 'text-danger-600 hover:text-danger-900 hover:bg-danger-50' : 'text-success-600 hover:text-success-900 hover:bg-success-50'
                        } transition duration-150 ease-in-out`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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