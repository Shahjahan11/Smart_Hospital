
export const USER_ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  NURSE: 'Nurse',
  STAFF: 'Staff',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'No Show',
};

export const BILL_STATUS = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
  PARTIAL: 'Partial',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const PAYMENT_METHODS = {
  CARD: 'Card',
  CASH: 'Cash',
  ONLINE: 'Online',
  WALLET: 'Wallet',
  QR: 'QR',
  INSURANCE: 'Insurance',
};

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

export const SPECIALIZATIONS = [
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
  'General Medicine',
  'Dental',
  'Physiotherapy',
  'Anesthesiology',
  'Emergency Medicine',
];

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
];

export const MARITAL_STATUS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
];

export const APPOINTMENT_TYPES = [
  'Consultation',
  'Follow-up',
  'Emergency',
  'Routine Checkup',
  'Surgery',
  'Lab Test',
  'Scan',
  'Therapy',
];

export const ROOM_TYPES = [
  'General Ward',
  'Private Room',
  'ICU',
  'Emergency',
  'Operation Theater',
  'Labor & Delivery',
  'Pediatric',
  'Isolation',
];

export const INVENTORY_CATEGORIES = [
  'Medication',
  'Medical Equipment',
  'Surgical Supplies',
  'Lab Supplies',
  'Cleaning Supplies',
  'Office Supplies',
  'Food & Beverage',
  'Other',
];

export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  BILL: 'bill',
  PAYMENT: 'payment',
  PRESCRIPTION: 'prescription',
  SYSTEM: 'system',
  ALERT: 'alert',
  REMINDER: 'reminder',
};

export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export const CHART_COLORS = {
  primary: '#0ea5e9', 
  secondary: '#14b8a6', 
  tertiary: '#8b5cf6', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#6b7280',
};

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PIN_CODE: /^\d{6}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9 ]*$/,
  ALPHA_ONLY: /^[a-zA-Z ]*$/,
  NUMERIC: /^[0-9]*$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
  CART: 'cart',
  SETTINGS: 'settings',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  HINDI: 'hi',
  BENGALI: 'bn',
};

export const PAGINATION = {
  PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
  MAX_PAGE_BUTTONS: 5,
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  DISPLAY_TIME: 'h:mm a',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  SHORT: 'MM/dd/yyyy',
  LONG: 'EEEE, MMMM d, yyyy',
};

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, 
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOC_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export const ROLE_BASED_ROUTES = {
  [USER_ROLES.ADMIN]: [
    '/admin',
    '/admin/*',
    '/users',
    '/settings',
    '/reports',
  ],
  [USER_ROLES.DOCTOR]: [
    '/doctor',
    '/doctor/*',
    '/patients',
    '/appointments',
    '/prescriptions',
  ],
  [USER_ROLES.PATIENT]: [
    '/appointments',
    '/billing',
    '/medical-records',
    '/profile',
  ],
};

export const DEFAULT_SETTINGS = {
  theme: THEMES.LIGHT,
  language: LANGUAGES.ENGLISH,
  notifications: true,
  emailNotifications: true,
  smsNotifications: false,
  twoFactorAuth: false,
  autoSave: true,
};

export default {
  USER_ROLES,
  APPOINTMENT_STATUS,
  BILL_STATUS,
  PAYMENT_METHODS,
  SPECIALIZATIONS,
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  DATE_FORMATS,
  VALIDATION_PATTERNS,
  STORAGE_KEYS,
  PAGINATION,
};