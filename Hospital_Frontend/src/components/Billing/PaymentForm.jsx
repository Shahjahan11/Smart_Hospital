import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Save, 
  X, 
  CreditCard, 
  DollarSign, 
  Wallet,
  QrCode,
  Smartphone,
  ShieldCheck,
  Lock
} from 'lucide-react';

const PaymentForm = ({ bill, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    billId: bill?.id || '',
    patientId: bill?.patientId || '',
    amount: bill?.amount || 0,
    paymentMethod: 'Card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    saveCard: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bill) {
      setFormData(prev => ({
        ...prev,
        billId: bill.id,
        patientId: bill.patientId,
        amount: bill.amount
      }));
    }
  }, [bill]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (formData.paymentMethod === 'Card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCVC) newErrors.cardCVC = 'CVC is required';
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      const paymentData = {
        billId: parseInt(formData.billId),
        patientId: parseInt(formData.patientId),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: new Date().toISOString()
      };

      await axios.post('http://localhost:5181/api/Payment', paymentData);
      toast.success('Payment processed successfully!');
      onSubmit();
    } catch (error) {
      const errorMsg = error.response?.data || 'Payment failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'Card', name: 'Credit/Debit Card', icon: CreditCard, color: 'text-blue-600' },
    { id: 'Cash', name: 'Cash Payment', icon: DollarSign, color: 'text-green-600' },
    { id: 'Online', name: 'Online Banking', icon: Smartphone, color: 'text-purple-600' },
    { id: 'Wallet', name: 'Digital Wallet', icon: Wallet, color: 'text-amber-600' },
    { id: 'QR', name: 'QR Code', icon: QrCode, color: 'text-red-600' },
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {bill && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Bill Summary</h3>
            <div className="text-2xl font-bold text-gray-900">
              ${bill.amount.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Bill ID</p>
              <p className="font-medium">#{bill.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Patient</p>
              <p className="font-medium">{bill.patient?.fullName}</p>
            </div>
            <div>
              <p className="text-gray-500">Appointment</p>
              <p className="font-medium">#{bill.appointmentId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className={`font-medium ${bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                {bill.status}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="label">Payment Amount *</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={loading || !!bill}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
        {bill && (
          <p className="mt-1 text-xs text-gray-500">Amount cannot be changed for existing bills</p>
        )}
      </div>

      <div>
        <label className="label">Payment Method *</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
              className={`
                p-4 border rounded-xl transition-all duration-200 flex flex-col items-center
                ${formData.paymentMethod === method.id 
                  ? 'border-hospital-blue bg-blue-50 ring-2 ring-blue-500 ring-opacity-20' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <method.icon className={`h-6 w-6 mb-2 ${method.color}`} />
              <span className="text-xs font-medium text-gray-700">{method.name}</span>
            </button>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
        )}
      </div>

      {formData.paymentMethod === 'Card' && (
        <div className="space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Card Details</h4>
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          
          <div>
            <label className="label">Cardholder Name *</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              className={`input-field ${errors.cardName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>

          <div>
            <label className="label">Card Number *</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  handleChange({ ...e, target: { ...e.target, value: formatted } });
                }}
                className={`input-field pl-10 ${errors.cardNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                disabled={loading}
              />
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Expiry Date *</label>
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  handleChange({ ...e, target: { ...e.target, value: formatted } });
                }}
                className={`input-field ${errors.cardExpiry ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="MM/YY"
                maxLength="5"
                disabled={loading}
              />
              {errors.cardExpiry && (
                <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
              )}
            </div>

            <div>
              <label className="label">CVC *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.cardCVC ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="123"
                  maxLength="4"
                  disabled={loading}
                />
              </div>
              {errors.cardCVC && (
                <p className="mt-1 text-sm text-red-600">{errors.cardCVC}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleChange}
              className="h-4 w-4 text-hospital-blue rounded border-gray-300 focus:ring-hospital-blue"
              disabled={loading}
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-600">
              Save card details for future payments
            </label>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">Secure Payment</p>
            <p className="text-xs text-green-700">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          required
          className="h-4 w-4 text-hospital-blue rounded border-gray-300 focus:ring-hospital-blue mt-1"
          disabled={loading}
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I authorize Smart Hospital to charge my selected payment method for the amount shown above.
          I understand this payment is non-refundable.
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="font-medium">Total Amount Due:</p>
          <p className="text-2xl font-bold text-gray-900">${formData.amount.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;