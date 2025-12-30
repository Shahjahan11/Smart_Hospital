import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PatientCard from './PatientCard';
import Modal from '../Common/Modal';
import PatientForm from './PatientForm';
import Loader from '../Common/Loader';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  Users,
  Calendar,
  Activity,
  Download,
  Filter as FilterIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';
import axios from 'axios';

const PatientList = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState(new Set());

  const API_URL = 'http://localhost:5181/api/Patient';

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(API_URL);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchPatients();
  };

  const handleSelectPatient = (id) => {
    const newSelected = new Set(selectedPatients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPatients(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPatients.size === filteredPatients.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(filteredPatients.map(p => p.id)));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedPatients.size === 0) {
      toast.error('No patients selected');
      return;
    }

    switch (action) {
      case 'export':
        toast.success(`Exported ${selectedPatients.size} patients`);
        break;
      case 'message':
        toast.success(`Messaged ${selectedPatients.size} patients`);
        break;
      case 'schedule':
        toast.success(`Scheduled appointments for ${selectedPatients.size} patients`);
        break;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterStatus || 
                         patient.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.fullName?.localeCompare(b.fullName);
    } else {
      return b.fullName?.localeCompare(a.fullName);
    }
  });

  const mockPatients = [
    {
      id: 1,
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      status: 'Active',
      lastVisit: '2024-01-15',
      totalVisits: 12
    },
    {
      id: 2,
      fullName: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      status: 'Active',
      lastVisit: '2024-01-10',
      totalVisits: 8
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">
            Manage patient records and medical history
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedPatients.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedPatients.size} selected
              </span>
              <button
                onClick={() => handleBulkAction('export')}
                className="btn-secondary inline-flex items-center text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => handleBulkAction('schedule')}
                className="btn-primary inline-flex items-center text-sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule All
              </button>
            </div>
          )}
          
          {(user?.role === 'Admin' || user?.role === 'Doctor') && (
            <button
              onClick={handleCreate}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Patient
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(patients.length * 0.2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Visits</p>
              <p className="text-2xl font-bold text-gray-900">
                {(patients.reduce((sum, p) => sum + (p.totalVisits || 0), 0) / patients.length || 0).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Search Patients</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name, email, or phone"
              />
            </div>
          </div>

          <div>
            <label className="label">Filter by Status</label>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Sort by Name</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full btn-secondary inline-flex items-center justify-center"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc className="h-5 w-5 mr-2" />
                  A to Z
                </>
              ) : (
                <>
                  <SortDesc className="h-5 w-5 mr-2" />
                  Z to A
                </>
              )}
            </button>
          </div>
        </div>

        {selectedPatients.size > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-hospital-blue hover:text-blue-700 font-medium"
                >
                  {selectedPatients.size === filteredPatients.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {selectedPatients.size} patients selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('message')}
                  className="btn-secondary text-sm"
                >
                  Send Message
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="btn-primary text-sm"
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {sortedPatients.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus 
              ? 'Try adjusting your search or filter'
              : 'No patients available at the moment'}
          </p>
          {(searchTerm || filterStatus) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}
              className="mt-4 text-hospital-blue hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelectPatient}
              isSelected={selectedPatients.has(patient.id)}
              canEdit={user?.role === 'Admin' || user?.role === 'Doctor'}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <PatientForm
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default PatientList;