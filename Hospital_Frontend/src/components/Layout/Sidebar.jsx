import { 
  Home, 
  Users, 
  Stethoscope, 
  Calendar, 
  FileText, 
  CreditCard,
  Settings,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', roles: ['Admin', 'Doctor', 'Patient'] },
    { path: '/doctors', icon: Stethoscope, label: 'Doctors', roles: ['Admin', 'Patient'] },
    { path: '/patients', icon: Users, label: 'Patients', roles: ['Admin', 'Doctor'] },
    { path: '/appointments', icon: Calendar, label: 'Appointments', roles: ['Admin', 'Doctor', 'Patient'] },
    { path: '/billing', icon: CreditCard, label: 'Billing', roles: ['Admin', 'Patient'] },
  ];

  const filteredItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Logo for sidebar */}
      <div className="p-6 border-b border-gray-200 hidden lg:block">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-hospital-blue to-hospital-teal flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Smart Hospital</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-hospital-blue text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${({ isActive }) => isActive ? 'rotate-90' : ''}`} />
          </NavLink>
        ))}
      </nav>

      {/* Footer / User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-hospital-blue to-hospital-teal flex items-center justify-center text-white font-semibold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;