import { 
  Mail, 
  Phone, 
  BriefcaseMedical, 
  Calendar, 
  Star,
  Edit,
  Trash2,
  MapPin,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorCard = ({ doctor, onEdit, onDelete, canEdit }) => {
  const getSpecializationColor = (specialization) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Neurology': 'bg-blue-100 text-blue-800',
      'Orthopedics': 'bg-green-100 text-green-800',
      'Pediatrics': 'bg-yellow-100 text-yellow-800',
      'Surgery': 'bg-purple-100 text-purple-800',
      'Dermatology': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    
    return colors[specialization] || colors.default;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isAvailable = Math.random() > 0.3;
  const rating = (Math.random() * 2 + 3).toFixed(1); 
  const experience = Math.floor(Math.random() * 20) + 5; 

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="card hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(doctor.fullName)}
            </div>
            {isAvailable && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900">{doctor.fullName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getSpecializationColor(doctor.specialization)}`}>
                {doctor.specialization}
              </span>
              {isAvailable ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Available
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(doctor)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit doctor"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(doctor.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete doctor"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          {doctor.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{doctor.phone}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Star className="h-4 w-4 text-amber-500 mr-1" />
              <span className="font-semibold text-gray-900">{rating}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Award className="h-4 w-4 text-purple-500 mr-1" />
              <span className="font-semibold text-gray-900">{experience}y</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Experience</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-semibold text-gray-900">24</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">This Week</p>
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-hospital-blue font-medium rounded-lg border border-blue-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
          <Calendar className="inline h-4 w-4 mr-2" />
          Book Appointment
        </button>
      </div>

      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-8 translate-x-8"></div>
    </motion.div>
  );
};

export default DoctorCard;