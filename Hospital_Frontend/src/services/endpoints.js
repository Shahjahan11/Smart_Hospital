export const endpoints = {
  auth: {
    login: '/Auth/login',
    register: '/Auth/register',
    me: '/Auth/me',
    refreshToken: '/Auth/refresh-token',
    profile: '/Auth/profile',
    changePassword: '/Auth/change-password',
    forgotPassword: '/Auth/forgot-password',
    resetPassword: '/Auth/reset-password',
    verifyEmail: '/Auth/verify-email',
    resendVerification: '/Auth/resend-verification',
  },

  users: {
    base: '/User',
    list: '/User',
    get: (id) => `/User/${id}`,
    create: '/User',
    update: (id) => `/User/${id}`,
    delete: (id) => `/User/${id}`,
    search: '/User/search',
  },

  doctors: {
    base: '/Doctor',
    list: '/Doctor',
    get: (id) => `/Doctor/${id}`,
    create: '/Doctor',
    update: (id) => `/Doctor/${id}`,
    delete: (id) => `/Doctor/${id}`,
    search: '/Doctor/search',
    availability: (id) => `/Doctor/${id}/availability`,
    schedule: (id) => `/Doctor/${id}/schedule`,
  },

  patients: {
    base: '/Patient',
    list: '/Patient',
    get: (id) => `/Patient/${id}`,
    create: '/Patient',
    update: (id) => `/Patient/${id}`,
    delete: (id) => `/Patient/${id}`,
    search: '/Patient/search',
    medicalHistory: (id) => `/Patient/${id}/medical-history`,
    prescriptions: (id) => `/Patient/${id}/prescriptions`,
  },

  appointments: {
    base: '/Appointment',
    list: '/Appointment',
    get: (id) => `/Appointment/${id}`,
    create: '/Appointment',
    update: (id) => `/Appointment/${id}`,
    delete: (id) => `/Appointment/${id}`,
    patientAppointments: (patientId) => `/Appointment/patient/${patientId}`,
    doctorAppointments: (doctorId) => `/Appointment/doctor/${doctorId}`,
    upcoming: '/Appointment/upcoming',
    today: '/Appointment/today',
    status: (id) => `/Appointment/${id}/status`,
    reschedule: (id) => `/Appointment/${id}/reschedule`,
  },

  bills: {
    base: '/Bill',
    list: '/Bill',
    get: (id) => `/Bill/${id}`,
    create: '/Bill',
    update: (id) => `/Bill/${id}`,
    delete: (id) => `/Bill/${id}`,
    patientBills: (patientId) => `/Bill/patient/${patientId}`,
    generate: '/Bill/generate',
    status: (id) => `/Bill/${id}/status`,
    download: (id) => `/Bill/${id}/download`,
    send: (id) => `/Bill/${id}/send`,
  },

  payments: {
    base: '/Payment',
    list: '/Payment',
    get: (id) => `/Payment/${id}`,
    create: '/Payment',
    update: (id) => `/Payment/${id}`,
    delete: (id) => `/Payment/${id}`,
    patientPayments: (patientId) => `/Payment/patient/${patientId}`,
    verify: (id) => `/Payment/${id}/verify`,
    receipt: (id) => `/Payment/${id}/receipt`,
    refund: (id) => `/Payment/${id}/refund`,
  },

  medicalRecords: {
    base: '/MedicalRecord',
    list: '/MedicalRecord',
    get: (id) => `/MedicalRecord/${id}`,
    create: '/MedicalRecord',
    update: (id) => `/MedicalRecord/${id}`,
    delete: (id) => `/MedicalRecord/${id}`,
    patientRecords: (patientId) => `/MedicalRecord/patient/${patientId}`,
    upload: '/MedicalRecord/upload',
  },

  prescriptions: {
    base: '/Prescription',
    list: '/Prescription',
    get: (id) => `/Prescription/${id}`,
    create: '/Prescription',
    update: (id) => `/Prescription/${id}`,
    delete: (id) => `/Prescription/${id}`,
    patientPrescriptions: (patientId) => `/Prescription/patient/${patientId}`,
    print: (id) => `/Prescription/${id}/print`,
  },

  departments: {
    base: '/Department',
    list: '/Department',
    get: (id) => `/Department/${id}`,
    create: '/Department',
    update: (id) => `/Department/${id}`,
    delete: (id) => `/Department/${id}`,
    doctors: (id) => `/Department/${id}/doctors`,
  },

  rooms: {
    base: '/Room',
    list: '/Room',
    get: (id) => `/Room/${id}`,
    create: '/Room',
    update: (id) => `/Room/${id}`,
    delete: (id) => `/Room/${id}`,
    available: '/Room/available',
    assign: (id) => `/Room/${id}/assign`,
    discharge: (id) => `/Room/${id}/discharge`,
  },

  inventory: {
    base: '/Inventory',
    list: '/Inventory',
    get: (id) => `/Inventory/${id}`,
    create: '/Inventory',
    update: (id) => `/Inventory/${id}`,
    delete: (id) => `/Inventory/${id}`,
    lowStock: '/Inventory/low-stock',
    category: (category) => `/Inventory/category/${category}`,
    restock: (id) => `/Inventory/${id}/restock`,
  },

  notifications: {
    base: '/Notification',
    list: '/Notification',
    get: (id) => `/Notification/${id}`,
    create: '/Notification',
    update: (id) => `/Notification/${id}`,
    delete: (id) => `/Notification/${id}`,
    userNotifications: '/Notification/user',
    markRead: (id) => `/Notification/${id}/read`,
    markAllRead: '/Notification/read-all',
    unreadCount: '/Notification/unread-count',
  },

  reports: {
    base: '/Report',
    financial: '/Report/financial',
    appointmentStats: '/Report/appointment-stats',
    patientStats: '/Report/patient-stats',
    revenue: '/Report/revenue',
    export: '/Report/export',
    dashboard: '/Report/dashboard',
  },

  settings: {
    base: '/Settings',
    get: '/Settings',
    update: '/Settings',
    email: '/Settings/email',
    sms: '/Settings/sms',
    payment: '/Settings/payment',
    backup: '/Settings/backup',
  },

  upload: {
    base: '/Upload',
    image: '/Upload/image',
    document: '/Upload/document',
    medical: '/Upload/medical',
    avatar: '/Upload/avatar',
  },
};

export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, v));
      } else {
        query.append(key, value);
      }
    }
  });
  
  return query.toString() ? `?${query.toString()}` : '';
};

export const buildUrl = (endpoint, params = {}) => {
  const queryString = buildQueryString(params);
  return `${endpoint}${queryString}`;
};

export default endpoints;