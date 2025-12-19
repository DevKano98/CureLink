import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import RoleGuard from '../components/RoleGuard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, appsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/appointments')
        ]);

        const users = usersRes.data;
        const appointments = appsRes.data;

        setStats({
          totalUsers: users.length,
          activeDoctors: users.filter(u => u.role === 'doctor' && u.isActive).length,
          totalAppointments: appointments.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
              {[
                { name: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { name: 'Active Doctors', value: stats.activeDoctors, icon: '👨‍⚕️' },
                { name: 'Total Appointments', value: stats.totalAppointments, icon: '📅' },
              ].map((item, i) => (
                <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to="/admin/users"
                  className="block p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-300 hover:bg-primary-50 text-center font-medium text-primary-600 transition-all duration-200 ease-in-out hover:shadow-md"
                >
                  Manage Users & Doctors
                </Link>
                <Link
                  to="/admin/appointments"
                  className="block p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-300 hover:bg-primary-50 text-center font-medium text-primary-600 transition-all duration-200 ease-in-out hover:shadow-md"
                >
                  View All Appointments
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}