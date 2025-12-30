import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-4xl">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="hidden lg:flex flex-col justify-center">
            <div className="bg-gradient-to-br from-hospital-teal to-emerald-500 rounded-2xl p-8 text-white h-full shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Join Our Healthcare Community</h2>
                
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-bold mb-2 text-lg">For Patients</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Book appointments online 24/7
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Access medical records anytime
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Receive digital prescriptions
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Get appointment reminders
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-bold mb-2 text-lg">For Doctors</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Manage patient schedules
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Access patient history instantly
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Issue digital prescriptions
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Collaborate with other specialists
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-bold mb-2 text-lg">Security & Privacy</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        HIPAA compliant data storage
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        End-to-end encryption
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Two-factor authentication
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                        Regular security audits
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-4">Already have thousands of satisfied users</p>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold">10K+</div>
                      <div className="text-xs opacity-80">Patients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">100+</div>
                      <div className="text-xs opacity-80">Doctors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">50+</div>
                      <div className="text-xs opacity-80">Hospitals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.6★</div>
                      <div className="text-xs opacity-80">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <AuthForm
              type="register"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              success={success}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;