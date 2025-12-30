import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Save, 
  X, 
  Calendar, 
  User, 
  Stethoscope,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AppointmentForm = ({ appointment, onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDateTime: '',
    notes: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:5181/api';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/Doctor`);
        setDoctors(response.data);
      } catch (error) {
        toast.error('Failed to load doctors');
      }
    };

    fetchDoctors();

    if (appointment) {
      setFormData({
        doctorId: appointment.doctorId?.toString() || '',
        appointmentDateTime: appointment.appointmentDate 
          ? format(parseISO(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm")
          : '',
        notes: appointment.reason || '',
        phone: ''
      });
    } else if (user?.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone }));
    }
  }, [appointment, user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.doctorId) newErrors.doctorId = 'Please select a doctor';
    if (!formData.appointmentDateTime) newErrors.appointmentDateTime = 'Please select date and time';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        doctorId: parseInt(formData.doctorId),
        appointmentDateTime: formData.appointmentDateTime,
        notes: formData.notes,
        phone: formData.phone
      };

      let response;
      if (appointment) {
        response = await axios.put(
          `${API_URL}/Appointment/update/${appointment.id}`,
          appointmentData
        );
      } else {
        response = await axios.post(
          `${API_URL}/Appointment/book`,
          appointmentData
        );
      }

      toast.success(appointment ? 'Appointment updated!' : 'Appointment booked!');
      onSubmit();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Operation failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">
          <Stethoscope className="inline h-4 w-4 mr-2" />
          Select Doctor *
        </label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
          className={`input-field ${errors.doctorId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          disabled={loading}
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.fullName} - {doctor.specialization}
            </option>
          ))}
        </select>
        {errors.doctorId && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {errors.doctorId}
          </p>
        )}
      </div>

      <div>
        <label className="label">
          <Calendar className="inline h-4 w-4 mr-2" />
          Date & Time *
        </label>
        <input
          type="datetime-local"
          value={formData.appointmentDateTime}
          onChange={(e) => setFormData({...formData, appointmentDateTime: e.target.value})}
          className={`input-field ${errors.appointmentDateTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          disabled={loading}
        />
        {errors.appointmentDateTime && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {errors.appointmentDateTime}
          </p>
        )}
      </div>

      <div>
        <label className="label">
          <User className="inline h-4 w-4 mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="input-field"
          placeholder="Your phone number"
          disabled={loading}
        />
      </div>

      <div>
        <label className="label">Additional Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="input-field min-h-[100px]"
          placeholder="Any specific concerns or symptoms you'd like to mention..."
          disabled={loading}
          rows="3"
        />
      </div>

      {formData.doctorId && formData.appointmentDateTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Appointment Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600">Doctor:</span>
              <span className="font-medium">
                {doctors.find(d => d.id == formData.doctorId)?.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Date:</span>
              <span className="font-medium">
                {format(new Date(formData.appointmentDateTime), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Time:</span>
              <span className="font-medium">
                {format(new Date(formData.appointmentDateTime), 'h:mm a')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Patient:</span>
              <span className="font-medium">{user?.fullName}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary inline-flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary inline-flex items-center"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {appointment ? 'Updating...' : 'Booking...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {appointment ? 'Update Appointment' : 'Book Appointment'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;