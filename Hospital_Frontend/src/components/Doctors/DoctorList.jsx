import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DoctorCard from './DoctorCard';
import DoctorForm from './DoctorForm';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  Users,
  Stethoscope,
  SortAsc,
  SortDesc
} from 'lucide-react';
import axios from 'axios';

const DoctorList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const API_URL = 'http://localhost:5181/api/Doctor';

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreate = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterSpecialization || 
                         doctor.specialization?.toLowerCase().includes(filterSpecialization.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.fullName?.localeCompare(b.fullName);
    } else {
      return b.fullName?.localeCompare(a.fullName);
    }
  });

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

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
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">
            Manage medical professionals and their specializations
          </p>
        </div>
        
        {user?.role === 'Admin' && (
          <button
            onClick={handleCreate}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Doctor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Specializations</p>
              <p className="text-2xl font-bold text-gray-900">{specializations.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {doctors.filter(d => d.available !== false).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Search Doctors</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name, specialization or email"
              />
            </div>
          </div>

          <div>
            <label className="label">Filter by Specialization</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="input-field pl-10"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
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
      </div>

      {sortedDoctors.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">
            {searchTerm || filterSpecialization 
              ? 'Try adjusting your search or filter'
              : 'No doctors available at the moment'}
          </p>
          {(searchTerm || filterSpecialization) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSpecialization('');
              }}
              className="mt-4 text-hospital-blue hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={user?.role === 'Admin'}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
      >
        <DoctorForm
          doctor={editingDoctor}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default DoctorList;