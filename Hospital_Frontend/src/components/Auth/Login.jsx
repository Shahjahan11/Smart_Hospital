import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AuthForm
              type="login"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>

          <div className="hidden lg:flex flex-col justify-center">
            <div className="bg-gradient-to-br from-hospital-blue to-hospital-teal rounded-2xl p-8 text-white h-full shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Why Choose Smart Hospital?</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="font-bold">✓</span>
                    </div>
                    <span>24/7 Access to Medical Records</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="font-bold">✓</span>
                    </div>
                    <span>Secure & Encrypted Data Protection</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="font-bold">✓</span>
                    </div>
                    <span>Easy Appointment Booking</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="font-bold">✓</span>
                    </div>
                    <span>Digital Prescriptions & Reports</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="font-bold">✓</span>
                    </div>
                    <span>Real-time Health Monitoring</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <h3 className="font-bold mb-2">Patient Testimonial</h3>
                  <p className="text-sm italic">"Smart Hospital made managing my diabetes so much easier. I can track everything in one place!"</p>
                  <p className="text-sm mt-2">- Monjuara, Patient since 2023</p>
                </div>

                <div className="text-center">
                  <p className="text-sm opacity-90">Trusted by over 6,000 patients and 100+ doctors nationwide</p>
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">99%</div>
                      <div className="text-xs opacity-80">Patient Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-xs opacity-80">Support Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">HIPAA</div>
                      <div className="text-xs opacity-80">Compliant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;