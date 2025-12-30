import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Droplet,
  Users, 
  Activity,
  FileText,
  Edit,
  Trash2,
  Check, 
  CheckSquare, 
  Square, 
  Heart 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const PatientCard = ({ patient, onEdit, onDelete, onSelect, isSelected, canEdit }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    switch (bloodGroup) {
      case 'A+': return 'bg-red-50 text-red-700 border-red-200';
      case 'B+': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'O+': return 'bg-green-50 text-green-700 border-green-200';
      case 'AB+': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.dateOfBirth) || patient.age || 'N/A';

  const lastVisit = patient.lastVisit ? format(new Date(patient.lastVisit), 'MMM dd, yyyy') : 'Never';
  const totalVisits = patient.totalVisits || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`card hover:shadow-lg transition-all duration-300 overflow-hidden group ${isSelected ? 'ring-2 ring-hospital-blue ring-offset-2' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {onSelect && (
            <button
              onClick={() => onSelect(patient.id)}
              className="mt-1 text-gray-400 hover:text-hospital-blue transition-colors"
            >
              {isSelected ? (
                <Check className="h-5 w-5 text-hospital-blue" /> 
              ) : (
                <div className="h-5 w-5 border-2 border-gray-400 rounded"></div> 
              )}
            </button>
          )}
          
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(patient.fullName)}
            </div>
            <div className="absolute -bottom-1 -right-1">
              <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                {patient.status || 'Active'}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900">{patient.fullName}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-600">
                {age}y • {patient.gender || 'N/A'}
              </span>
              {patient.bloodGroup && (
                <span className={`text-xs px-2 py-1 rounded-full border ${getBloodGroupColor(patient.bloodGroup)}`}>
                  {patient.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(patient)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit patient"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(patient.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete patient"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{patient.email}</span>
          </div>
          {patient.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{patient.phone}</span>
            </div>
          )}
          {patient.address && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="truncate">{patient.address}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="font-semibold text-gray-900">{totalVisits}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total Visits</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 text-purple-500 mr-1" />
              <span className="font-semibold text-gray-900 text-sm">{lastVisit}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last Visit</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Heart className="h-4 w-4 text-red-500 mr-1" /> {/* Changed from HeartPulse */}
              <span className="font-semibold text-gray-900">Normal</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Condition</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
          <button className="py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-hospital-blue font-medium rounded-lg border border-blue-200 transition-all duration-200 hover:border-blue-300 text-sm">
            <FileText className="inline h-4 w-4 mr-1" />
            View History
          </button>
          <button className="py-2 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-700 font-medium rounded-lg border border-teal-200 transition-all duration-200 hover:border-teal-300 text-sm">
            <Calendar className="inline h-4 w-4 mr-1" />
            Book Visit
          </button>
        </div>

        {patient.emergencyContact && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Emergency Contact</p>
            <p className="text-sm font-medium text-gray-900">{patient.emergencyContact}</p>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full -translate-y-8 translate-x-8"></div>
    </motion.div>
  );
};

export default PatientCard;