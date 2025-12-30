import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  CreditCard, 
  TrendingUp,
  Activity,
  Clock,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Today\'s Appointments', 
      value: '24', 
      icon: Calendar, 
      color: 'bg-blue-500',
      change: '+12%' 
    },
    { 
      label: 'Total Patients', 
      value: '1,234', 
      icon: Users, 
      color: 'bg-green-500',
      change: '+8%' 
    },
    { 
      label: 'Active Doctors', 
      value: '45', 
      icon: Stethoscope, 
      color: 'bg-purple-500',
      change: '+5%' 
    },
    { 
      label: 'Monthly Revenue', 
      value: '$89,420', 
      icon: CreditCard, 
      color: 'bg-amber-500',
      change: '+18%' 
    },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Johnson', time: '10:30 AM', status: 'Confirmed' },
    { id: 2, patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', time: '11:45 AM', status: 'Pending' },
    { id: 3, patient: 'Robert Brown', doctor: 'Dr. Lisa Wang', time: '2:15 PM', status: 'Confirmed' },
    { id: 4, patient: 'Maria Garcia', doctor: 'Dr. David Lee', time: '3:30 PM', status: 'Cancelled' },
  ];

  const quickActions = [
    { label: 'Book Appointment', icon: Calendar, color: 'bg-hospital-blue', path: '/appointments' },
    { label: 'View Patients', icon: Users, color: 'bg-hospital-teal', path: '/patients' },
    { label: 'Manage Doctors', icon: Stethoscope, color: 'bg-hospital-purple', path: '/doctors' },
    { label: 'Process Bills', icon: CreditCard, color: 'bg-amber-500', path: '/billing' },
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-hospital-blue to-hospital-teal rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-blue-100">
              {user?.role === 'Doctor' ? 'Ready for today\'s appointments?' : 
               user?.role === 'Patient' ? 'How can we help you today?' : 
               'Monitor your hospital management dashboard'}
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => window.location.href = action.path}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-hospital-blue hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`${action.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-hospital-blue">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
            <p className="text-sm text-gray-500">Last 30 days performance metrics</p>
          </div>
          <Award className="h-6 w-6 text-amber-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Patient Satisfaction</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="font-semibold">92%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Appointment Completion</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <span className="font-semibold">88%</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-hospital-blue mx-auto mb-3" />
                <p className="text-gray-500">Performance chart visualization</p>
                <p className="text-sm text-gray-400 mt-1">(Chart would appear here in production)</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;