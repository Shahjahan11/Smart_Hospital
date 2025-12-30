import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Save, X, User, Mail, Phone, BriefcaseMedical } from 'lucide-react';

const DoctorForm = ({ doctor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:5181/api/Doctor';

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Gynecology',
    'Urology',
    'Endocrinology',
    'Gastroenterology',
    'Oncology',
    'Ophthalmology',
    'ENT',
    'General Medicine'
  ];

  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || ''
      });
    }
  }, [doctor]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (doctor) {
        await axios.put(`${API_URL}/${doctor.id}`, formData);
        toast.success('Doctor updated successfully');
      } else {
        await axios.post(API_URL, formData);
        toast.success('Doctor created successfully');
      }
      onSubmit();
    } catch (error) {
      const errorMsg = error.response?.data || 'Operation failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">
          <User className="inline h-4 w-4 mr-2" />
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`input-field ${errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          placeholder="Dr. John Doe"
          disabled={loading}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="label">
          <Mail className="inline h-4 w-4 mr-2" />
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          placeholder="doctor@hospital.com"
          disabled={loading || !!doctor}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        {doctor && (
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed after creation</p>
        )}
      </div>

      <div>
        <label className="label">
          <Phone className="inline h-4 w-4 mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          placeholder="+1 (555) 123-4567"
          disabled={loading}
        />
      </div>

      <div>
        <label className="label">
          <BriefcaseMedical className="inline h-4 w-4 mr-2" />
          Specialization *
        </label>
        <div className="relative">
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className={`input-field ${errors.specialization ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">Select a specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        {errors.specialization && (
          <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
        )}
      </div>

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
              {doctor ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {doctor ? 'Update Doctor' : 'Create Doctor'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;