import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentForm from './AppointmentForm';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewAppointment, setViewAppointment] = useState(null);

  const API_URL = 'http://localhost:5181/api/Appointment';

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleView = (appointment) => {
    setViewAppointment(appointment);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to delete appointment';
      toast.error(errorMsg);
      console.error('Delete error:', error);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingAppointment(null);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {user?.role === 'Patient' && (
            <button
              onClick={handleCreate}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Appointment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'Pending').length}
              </p>
            </div>
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'Confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => {
                  const today = new Date().toDateString();
                  const appDate = new Date(a.appointmentDate).toDateString();
                  return appDate === today;
                }).length}
              </p>
            </div>
            <AlertCircle className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 w-full"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus 
                ? 'Try adjusting your search or filters' 
                : 'No appointments scheduled yet'}
            </p>
            {user?.role === 'Patient' && (
              <button
                onClick={handleCreate}
                className="btn-primary"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(appointment.appointmentDate), 'MMM d, yyyy')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(appointment.appointmentDate), 'h:mm a')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Patient</span>
                      </div>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.patientEmail}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Stethoscope className="h-4 w-4" />
                        <span className="text-sm">Doctor</span>
                      </div>
                      <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-500">{appointment.doctorSpecialization}</p>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="mt-2 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Reason / Notes</p>
                      <p className="text-gray-700">{appointment.reason}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(appointment)}
                    className="btn-secondary inline-flex items-center"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {(user?.role === 'Patient' && appointment.isMyAppointment) && (
                    <>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="btn-secondary inline-flex items-center"
                        title="Edit Appointment"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="btn-danger inline-flex items-center"
                        title="Delete Appointment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  {user?.role === 'Doctor' && appointment.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}
                        className="btn-success inline-flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}
                        className="btn-danger inline-flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {user?.role === 'Admin' && (
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="btn-danger inline-flex items-center"
                      title="Delete Appointment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAppointment(null);
        }}
        title={editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
        size="lg"
      >
        <AppointmentForm
          appointment={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
          user={user}
        />
      </Modal>

      <Modal
        isOpen={!!viewAppointment}
        onClose={() => setViewAppointment(null)}
        title="Appointment Details"
      >
        {viewAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Appointment ID</p>
                <p className="font-medium text-gray-900">#{viewAppointment.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(viewAppointment.status)}`}>
                  {viewAppointment.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(viewAppointment.appointmentDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(viewAppointment.appointmentDate), 'h:mm a')}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Patient</p>
                  <p className="font-medium text-gray-900">{viewAppointment.patientName}</p>
                  <p className="text-sm text-gray-500">{viewAppointment.patientEmail}</p>
                  <p className="text-sm text-gray-500">{viewAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Doctor</p>
                  <p className="font-medium text-gray-900">{viewAppointment.doctorName}</p>
                  <p className="text-sm text-gray-500">{viewAppointment.doctorSpecialization}</p>
                  <p className="text-sm text-gray-500">{viewAppointment.doctorEmail}</p>
                </div>
              </div>
            </div>

            {viewAppointment.reason && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Reason / Notes</p>
                <p className="text-gray-700">{viewAppointment.reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentList;