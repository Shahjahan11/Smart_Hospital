import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hospital,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Calendar,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { isValidEmail, isValidPhone, validatePassword } from '../../utils/helpers';

const AuthForm = ({ 
  type = 'login', // 'login' or 'register'
  onSubmit,
  loading = false,
  error = null,
  success = null
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    role: 'Patient'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const roles = [
    { value: 'Patient', label: 'Patient', description: 'Book appointments and view medical history' },
    { value: 'Doctor', label: 'Doctor', description: 'Manage appointments and patient records' },
    { value: 'Admin', label: 'Administrator', description: 'Full system access and management' }
  ];

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!isValidEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else {
          const validation = validatePassword(value);
          if (!validation.isValid) {
            error = validation.message;
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
        
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
        
      case 'phone':
        if (value && !isValidPhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'dateOfBirth':
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          if (dob >= today) {
            error = 'Date of birth must be in the past';
          }
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }
    
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (type === 'register') {
      const fullNameError = validateField('fullName', formData.fullName);
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
      const phoneError = validateField('phone', formData.phone);
      
      if (fullNameError) {
        newErrors.fullName = fullNameError;
        isValid = false;
      }
      
      if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
        isValid = false;
      }
      
      if (phoneError) {
        newErrors.phone = phoneError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500'
    ];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-200'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-hospital-blue to-hospital-teal flex items-center justify-center shadow-lg">
            <Hospital className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600">
          {type === 'login' 
            ? 'Sign in to access your medical records and appointments' 
            : 'Join Smart Hospital for comprehensive healthcare management'}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <>
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
                  onBlur={handleBlur}
                  className={`input-field ${errors.fullName && touched.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="John Doe"
                  disabled={loading}
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Register As *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                      className={`
                        p-4 border rounded-xl text-left transition-all duration-200
                        ${formData.role === role.value 
                          ? 'border-hospital-blue bg-blue-50 ring-2 ring-blue-500 ring-opacity-20' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="font-medium text-gray-900">{role.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{role.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field pl-10 ${errors.phone && touched.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="+880 XXXXXXXXXX"
                    disabled={loading}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field min-h-[80px]"
                  placeholder="123 Main St, City, State, ZIP"
                  disabled={loading}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.dateOfBirth && touched.dateOfBirth ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="label">
              <Mail className="inline h-4 w-4 mr-2" />
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 ${errors.email && touched.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label">
                <Lock className="inline h-4 w-4 mr-2" />
                Password *
              </label>
              {type === 'login' && (
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-hospital-blue hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field pl-10 pr-10 ${errors.password && touched.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder={type === 'login' ? "Enter your password" : "Create a strong password"}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {type === 'register' && formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength</span>
                  <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
                <ul className="mt-2 text-xs text-gray-500 space-y-1">
                  <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    {formData.password.length >= 8 ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    Uppercase & lowercase letters
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[0-9]/.test(formData.password) ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    At least one number
                  </li>
                  <li className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[^A-Za-z0-9]/.test(formData.password) ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
            
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {type === 'register' && (
            <div>
              <label className="label">
                <Lock className="inline h-4 w-4 mr-2" />
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {type === 'register' && (
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-hospital-blue rounded border-gray-300 focus:ring-hospital-blue mt-1 flex-shrink-0"
                disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-hospital-blue hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-hospital-blue hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
                . I understand that my medical data will be handled according to HIPAA regulations.
              </label>
            </div>
          )}

          {type === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-hospital-blue rounded border-gray-300 focus:ring-hospital-blue"
                  disabled={loading}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center py-3 text-base"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                {type === 'login' ? 'Signing in...' : 'Creating Account...'}
              </>
            ) : (
              type === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to={type === 'login' ? "/register" : "/login"}
              className="btn-secondary w-full inline-flex items-center justify-center"
            >
              {type === 'login' ? 'Create an Account' : 'Sign In Instead'}
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-3">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong>{' '}
            {type === 'login' 
              ? "Contact support if you're having trouble accessing your account."
              : "Our team is available 24/7 to assist with registration and answer any questions."}
          </p>
          <a 
            href="mailto:support@smarthospital.com" 
            className="text-sm text-hospital-blue hover:text-blue-700 font-medium mt-1 inline-block"
          >
            support@smarthospital.com
          </a>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} Smart Hospital Management System. 
        All medical data is protected under HIPAA regulations.
      </p>
    </motion.div>
  );
};

export default AuthForm;