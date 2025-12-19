import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const navItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Book Appointment', path: '/appointments/book' },
          { name: 'My Records', path: '/records' }
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Appointments', path: '/appointments' },
          { name: 'Add Record', path: '/records/new' }
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Manage Users', path: '/admin/users' },
          { name: 'Appointments', path: '/admin/appointments' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-700 tracking-tight">CureLink</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems().map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:bg-primary-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium transition duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}