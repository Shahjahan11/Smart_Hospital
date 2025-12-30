import { motion } from 'framer-motion';
import { 
  Calendar, 
  Bell, 
  TrendingUp, 
  Award, 
  Sparkles,
  Clock,
  Target,
  Heart,
  Zap,
  Star,
  Shield,
  Users,
  Activity
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { APPOINTMENT_STATUS, BILL_STATUS } from '../../utils/constants';

const WelcomeCard = ({ user, stats, upcomingAppointments = [], notifications = [] }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleMessage = (role) => {
    switch (role) {
      case 'Admin':
        return 'Monitor system performance and manage operations';
      case 'Doctor':
        return 'Ready for today\'s patients and appointments';
      case 'Patient':
        return 'How can we help you feel better today?';
      case 'Nurse':
        return 'Take care of patients with compassion';
      default:
        return 'Welcome to Smart Hospital Management';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return Shield;
      case 'Doctor': return Heart;
      case 'Patient': return Users;
      case 'Nurse': return Activity;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(user?.role);

  const quickStats = [
    { 
      label: 'Today\'s Tasks', 
      value: stats?.tasks || 0, 
      icon: Target, 
      color: 'bg-blue-500',
      change: '+3'
    },
    { 
      label: 'Messages', 
      value: stats?.messages || 0, 
      icon: Bell, 
      color: 'bg-purple-500',
      change: '+5'
    },
    { 
      label: 'Achievements', 
      value: stats?.achievements || 0, 
      icon: Award, 
      color: 'bg-amber-500',
      change: '+2'
    },
    { 
      label: 'Performance', 
      value: `${stats?.performance || 0}%`, 
      icon: TrendingUp, 
      color: 'bg-green-500',
      change: '+12%'
    },
  ];

  const tips = [
    { icon: Star, text: 'Complete your profile for personalized care' },
    { icon: Shield, text: 'Your data is securely encrypted and protected' },
    { icon: Zap, text: 'Book appointments faster with our mobile app' },
    { icon: Clock, text: 'Arrive 15 minutes early for your appointments' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-hospital-blue via-blue-500 to-hospital-teal rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <RoleIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {getGreeting()}, {user?.fullName?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-blue-100 mt-1">{getRoleMessage(user?.role)}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-4 space-x-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {formatDate(new Date(), 'EEEE, MMMM d, yyyy')}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {user?.role}
              </span>
              {user?.lastLogin && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Last login: {formatDate(user.lastLogin, 'MMM d, h:mm a')}
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <Sparkles className="h-12 w-12 text-yellow-300 opacity-80" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-300 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Appointments
              </h2>
              <span className="text-sm text-blue-100">
                {upcomingAppointments?.length || 0} scheduled
              </span>
            </div>

            {upcomingAppointments?.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          appointment.status === APPOINTMENT_STATUS.CONFIRMED ? 'bg-green-400' :
                          appointment.status === APPOINTMENT_STATUS.PENDING ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`}></div>
                        <span className="font-medium">
                          {appointment.doctor?.fullName || 'Dr. Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-100 mt-1">
                        {formatDate(appointment.appointmentDate, 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === APPOINTMENT_STATUS.CONFIRMED ? 'bg-green-500/30 text-green-300' :
                        appointment.status === APPOINTMENT_STATUS.PENDING ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-blue-500/30 text-blue-300'
                      }`}>
                        {appointment.status}
                      </span>
                      <p className="text-xs text-blue-100 mt-1">
                        {appointment.patient?.fullName || 'Patient'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-blue-100">No upcoming appointments</p>
                <button className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                  Book Appointment
                </button>
              </div>
            )}

            {upcomingAppointments?.length > 3 && (
              <div className="text-center mt-4 pt-4 border-t border-white/20">
                <button className="text-sm text-blue-200 hover:text-white font-medium">
                  View all {upcomingAppointments.length} appointments →
                </button>
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </h2>
                {notifications?.length > 0 && (
                  <span className="h-2 w-2 bg-red-400 rounded-full"></span>
                )}
              </div>

              {notifications?.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div
                      key={notification.id}
                      className="flex items-start p-3 bg-white/5 rounded-lg"
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        notification.type === 'alert' ? 'bg-red-500/20' :
                        notification.type === 'reminder' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-blue-100 mt-1">{notification.message}</p>
                        <p className="text-xs text-white/50 mt-2">
                          {formatDate(notification.time, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-blue-100 py-4">No new notifications</p>
              )}

              {notifications?.length > 3 && (
                <button className="w-full mt-4 py-2 text-sm text-blue-200 hover:text-white font-medium">
                  Show all notifications
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Quick Tips
              </h2>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-1.5 bg-white/20 rounded-lg mr-3">
                      <tip.icon className="h-3 w-3" />
                    </div>
                    <p className="text-sm text-blue-100 flex-1">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-white text-hospital-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Calendar className="inline h-4 w-4 mr-2" />
            Book Appointment
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            <Bell className="inline h-4 w-4 mr-2" />
            View Messages
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            <TrendingUp className="inline h-4 w-4 mr-2" />
            View Reports
          </motion.button>
          
          {user?.role === 'Admin' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              <Shield className="inline h-4 w-4 mr-2" />
              Admin Panel
            </motion.button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-blue-100 italic">
            "The art of medicine consists of amusing the patient while nature cures the disease."
          </p>
          <p className="text-sm text-white/70 mt-1">— Voltaire</p>
        </div>
      </div>
    </motion.div>
  );
};

WelcomeCard.defaultProps = {
  stats: {
    tasks: 5,
    messages: 3,
    achievements: 12,
    performance: 94
  },
  upcomingAppointments: [
    {
      id: 1,
      doctor: { fullName: 'Dr. Sarah Johnson' },
      patient: { fullName: 'John Smith' },
      appointmentDate: new Date().toISOString(),
      status: 'Confirmed'
    },
    {
      id: 2,
      doctor: { fullName: 'Dr. Michael Chen' },
      patient: { fullName: 'Emma Wilson' },
      appointmentDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'Pending'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'reminder',
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 10:30 AM',
      time: new Date().toISOString()
    },
    {
      id: 2,
      type: 'alert',
      title: 'New Message',
      message: 'Dr. Johnson sent you a message',
      time: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

export default WelcomeCard;