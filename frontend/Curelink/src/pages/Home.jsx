import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Users, Clock, Shield, Smartphone } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Your Health,
              <span className="text-primary-200"> Our Priority</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Seamlessly connect with healthcare professionals, manage appointments, and access your medical records anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAction}
                className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                {user ? 'Go to Dashboard' : 'Get Started Now'}
              </button>
              <button
                onClick={() => !user && navigate('/register')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-50 py-12 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-700">10K+</p>
              <p className="text-gray-600 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-700">500+</p>
              <p className="text-gray-600 mt-2">Healthcare Providers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-700">50K+</p>
              <p className="text-gray-600 mt-2">Appointments Booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary-600 font-semibold text-lg mb-2">Why Choose CureLink</h2>
            <h3 className="text-4xl font-bold text-gray-900">Everything You Need for Better Healthcare</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Easy Appointment Booking',
                desc: 'Browse available doctors, check schedules, and book appointments in seconds without phone calls.',
              },
              {
                icon: FileText,
                title: 'Digital Medical Records',
                desc: 'Secure access to prescriptions, diagnoses, and medical history all in one place.',
              },
              {
                icon: Users,
                title: 'Doctor Management',
                desc: 'Doctors can efficiently manage their schedules and patient consultations.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                desc: 'Your health data is protected with industry-standard encryption and privacy controls.',
              },
              {
                icon: Clock,
                title: 'Real-time Updates',
                desc: 'Get instant notifications about appointment confirmations and changes.',
              },
              {
                icon: Smartphone,
                title: 'Mobile Friendly',
                desc: 'Access CureLink on any device, anytime, anywhere for convenience.',
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md hover:bg-white transition-all duration-300 border border-gray-100"
              >
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Sign Up',
                desc: 'Create your account as a patient, doctor, or admin.',
              },
              {
                step: '2',
                title: 'Find Doctor',
                desc: 'Browse available doctors by specialization.',
              },
              {
                step: '3',
                title: 'Book Slot',
                desc: 'Choose preferred date and time for your appointment.',
              },
              {
                step: '4',
                title: 'Consult & Track',
                desc: 'Complete your appointment and access digital records.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-600 text-white mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 -right-3 text-2xl text-primary-300">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Healthcare?</h2>
          <p className="text-xl text-primary-100 mb-10">Join thousands of patients and doctors already using CureLink.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAction}
              className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 font-semibold text-white">CureLink</p>
          <p className="text-sm mb-6">Connecting Healthcare Providers and Patients</p>
          <p className="text-xs text-gray-500">© 2024 CureLink. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}