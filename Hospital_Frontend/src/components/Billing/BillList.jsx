import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PaymentForm from './PaymentForm';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  Printer,
  Mail
} from 'lucide-react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const BillList = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewMode, setViewMode] = useState('bills'); // 'bills' or 'payments'
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const API_URL = 'http://localhost:5181/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [billsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/Bill`),
        axios.get(`${API_URL}/Payment`)
      ]);
      setBills(billsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMakePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentForm(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleDownloadInvoice = (bill) => {
    toast.success('Invoice download started');
  };

  const handleSendInvoice = (bill) => {
    toast.success(`Invoice sent to ${bill.patient?.email}`);
  };

  const handlePaymentSubmit = () => {
    setShowPaymentForm(false);
    setSelectedBill(null);
    fetchData();
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toString().includes(searchTerm) ||
      bill.amount.toString().includes(searchTerm);

    const matchesStatus = !filterStatus || bill.status === filterStatus;
    
    const matchesDate = (!dateRange.start || new Date(bill.createdAt) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(bill.createdAt) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toString().includes(searchTerm) ||
      payment.amount.toString().includes(searchTerm);

    const matchesType = !filterType || payment.paymentMethod === filterType;
    
    const matchesDate = (!dateRange.start || new Date(payment.paymentDate) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(payment.paymentDate) <= new Date(dateRange.end));

    return matchesSearch && matchesType && matchesDate;
  });

  const stats = {
    totalBills: bills.length,
    totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
    paidBills: bills.filter(b => b.status === 'Paid').length,
    unpaidBills: bills.filter(b => b.status === 'Unpaid').length,
    totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
    pendingAmount: bills
      .filter(b => b.status === 'Unpaid')
      .reduce((sum, bill) => sum + bill.amount, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return CheckCircle;
      case 'Unpaid': return XCircle;
      case 'Partial': return Clock;
      default: return FileText;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card': return CreditCard;
      case 'cash': return DollarSign;
      case 'online': return TrendingUp;
      default: return CreditCard;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-1">
            Manage invoices, payments, and financial records
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('bills')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'bills' ? 'bg-hospital-blue text-white' : 'bg-white text-gray-700'}`}
            >
              Bills
            </button>
            <button
              onClick={() => setViewMode('payments')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'payments' ? 'bg-hospital-blue text-white' : 'bg-white text-gray-700'}`}
            >
              Payments
            </button>
          </div>
          
          <button
            onClick={() => window.print()}
            className="btn-secondary inline-flex items-center"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paidBills}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by patient, amount, or ID"
              />
            </div>
          </div>

          <div>
            <label className="label">Filter by</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={viewMode === 'bills' ? filterStatus : filterType}
                onChange={(e) => {
                  if (viewMode === 'bills') {
                    setFilterStatus(e.target.value);
                  } else {
                    setFilterType(e.target.value);
                  }
                }}
                className="input-field pl-10"
              >
                {viewMode === 'bills' ? (
                  <>
                    <option value="">All Bills</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                  </>
                ) : (
                  <>
                    <option value="">All Payments</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Date Range</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="input-field mb-2"
              placeholder="From"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="input-field"
              placeholder="To"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setDateRange({ start: '', end: '' });
                  setFilterStatus('');
                  setFilterType('');
                  setSearchTerm('');
                }}
                className="text-sm text-hospital-blue hover:text-blue-700 font-medium"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setDateRange({
                  start: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
                  end: format(new Date(), 'yyyy-MM-dd')
                })}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Last 30 Days
              </button>
            </div>
            <button className="btn-secondary inline-flex items-center text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'bills' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => {
                    const StatusIcon = getStatusIcon(bill.status);
                    return (
                      <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{bill.id}</div>
                          <div className="text-sm text-gray-500">INV-{bill.id.toString().padStart(6, '0')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                              {bill.patient?.fullName?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {bill.patient?.fullName || 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {bill.patient?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            ${bill.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bill.appointment ? `For Appointment #${bill.appointment.id}` : 'General Bill'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {bill.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bill.dueDate ? format(parseISO(bill.dueDate), 'MMM d, yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownloadInvoice(bill)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSendInvoice(bill)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Send Invoice"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMakePayment(bill)}
                              className="text-green-600 hover:text-green-900"
                              title="Make Payment"
                            >
                              <CreditCard className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="More Options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => {
                    const MethodIcon = getPaymentMethodIcon(payment.paymentMethod);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">PAY-{payment.id.toString().padStart(6, '0')}</div>
                          <div className="text-sm text-gray-500">For Bill #{payment.billId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                              {payment.patient?.fullName?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.patient?.fullName || 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.patient?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-green-900">
                            ${payment.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">Payment received</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MethodIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(parseISO(payment.paymentDate), 'MMM d, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(payment.paymentDate), 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewPayment(payment)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(payment.bill)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Download Receipt"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="More Options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
          <div className="space-y-4">
            {['Card', 'Cash', 'Online'].map((method) => {
              const count = payments.filter(p => p.paymentMethod === method).length;
              const percentage = payments.length ? (count / payments.length * 100).toFixed(1) : 0;
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{method}</span>
                    <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-hospital-blue h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all duration-200 group">
              <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                Generate Invoice
              </div>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all duration-200 group">
              <Receipt className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                View Reports
              </div>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 rounded-xl transition-all duration-200 group">
              <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                Revenue Analytics
              </div>
            </button>
            <button className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl transition-all duration-200 group">
              <FileText className="h-6 w-6 text-amber-600 mb-2" />
              <div className="text-sm font-medium text-gray-900 group-hover:text-amber-700">
                Tax Reports
              </div>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false);
          setSelectedBill(null);
        }}
        title="Make Payment"
        size="lg"
      >
        <PaymentForm
          bill={selectedBill}
          onSubmit={handlePaymentSubmit}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedBill(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-medium">PAY-{selectedPayment.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{format(parseISO(selectedPayment.paymentDate), 'MMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-green-600">${selectedPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium">{selectedPayment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-green-600">{selectedPayment.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bill ID</p>
                <p className="font-medium">#{selectedPayment.billId}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Patient Information</p>
              <p className="font-medium">{selectedPayment.patient?.fullName}</p>
              <p className="text-sm text-gray-500">{selectedPayment.patient?.email}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillList;