import { format, parseISO, isValid, differenceInYears, addDays } from 'date-fns';
import { DATE_FORMATS, VALIDATION_PATTERNS } from './constants';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (defaults to DISPLAY_WITH_TIME)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY_WITH_TIME) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'N/A';
  }
};

/**
 * Calculate age from birth date
 * @param {string|Date} birthDate - Birth date
 * @returns {number|null} Age in years or null if invalid
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(birthDateObj)) return null;
    
    return differenceInYears(new Date(), birthDateObj);
  } catch (error) {
    console.error('Age calculation error:', error);
    return null;
  }
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Bangladeshi numbers
  if (cleaned.length === 10) {
    // Local number without country code (e.g., 01712345678)
    return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('880')) {
    // Number with 880 prefix (without plus)
    return `+880 ${cleaned.slice(3, 7)} ${cleaned.slice(7, 10)}-${cleaned.slice(10)}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('880')) {
    // Number with country code and leading 0 (e.g., 8801712345678)
    return `+880 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  } else if (cleaned.length === 13) {
    // International format with + (e.g., 8801712345678 without +)
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  } else if (cleaned.length === 14 && cleaned.startsWith('880')) {
    // Full number with country code (e.g., 8801712345678)
    return `+880 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  // Return as-is for other formats
  return phone;
};
/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generate random color from name (consistent)
 * @param {string} name - Name to generate color from
 * @returns {string} Hex color code
 */
export const getColorFromName = (name) => {
  if (!name) return '#6b7280'; // Default gray
  
  const colors = [
    '#0ea5e9', // hospital-blue
    '#14b8a6', // hospital-teal
    '#8b5cf6', // hospital-purple
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f97316', // orange
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Bangladeshi phone validation rules:
  // 1. Total length should be 11 digits (01XXXXXXXXX) or 13 digits (8801XXXXXXXXX)
  // 2. Must start with 01 or 8801
  // 3. Third digit should be 3-9 (mobile operators: 3,4,5,6,7,8,9)
  
  // Check length
  if (cleaned.length !== 11 && cleaned.length !== 13) {
    return false;
  }
  
  // Check if it's 11 digits (local format: 01XXXXXXXXX)
  if (cleaned.length === 11) {
    return /^01[3-9]\d{8}$/.test(cleaned);
  }
  
  // Check if it's 13 digits (international: 8801XXXXXXXXX)
  if (cleaned.length === 13) {
    return /^8801[3-9]\d{8}$/.test(cleaned);
  }
  
  return false;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, number, and special character'
    };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.reduce((arr, item, i) => {
    arr[i] = deepClone(item);
    return arr;
  }, []);
  if (typeof obj === 'object') return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = deepClone(obj[key]);
    return newObj;
  }, {});
  return obj;
};

/**
 * Merge objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
export const deepMerge = (...objects) => {
  const isObject = obj => obj && typeof obj === 'object';
  
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = deepMerge(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {});
};

/**
 * Get query parameters from URL
 * @param {string} url - URL string
 * @returns {Object} Query parameters object
 */
export const getQueryParams = (url) => {
  const params = {};
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Convert object to query string
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const objectToQueryString = (params) => {
  if (!params) return '';
  
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Generate unique ID
 * @param {number} length - Length of ID
 * @returns {string} Unique ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Get file size in readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get status color class
 * @param {string} status 
 * @returns {string} 
 */
export const getStatusColorClass = (status) => {
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Rescheduled': 'bg-purple-100 text-purple-800',
    'No Show': 'bg-gray-100 text-gray-800',
    
    'Unpaid': 'bg-red-100 text-red-800',
    'Paid': 'bg-green-100 text-green-800',
    'Partial': 'bg-yellow-100 text-yellow-800',
    'Overdue': 'bg-orange-100 text-orange-800',
    'Refunded': 'bg-gray-100 text-gray-800',
    
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
    
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'Critical': 'bg-red-100 text-red-800',
    'Stable': 'bg-green-100 text-green-800',
    'Discharged': 'bg-blue-100 text-blue-800',
    'Admitted': 'bg-purple-100 text-purple-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Sort array by property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {boolean} ascending - Sort order
 * @returns {Array} Sorted array
 */
export const sortByProperty = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} properties - Properties to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (array, searchTerm, properties = []) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    if (properties.length > 0) {
      return properties.some(prop => {
        const value = item[prop];
        return value && value.toString().toLowerCase().includes(term);
      });
    }
    
    return Object.values(item).some(value => {
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Group array by property
 * @param {Array} array - Array to group
 * @param {string} property - Property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, property) => {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

export default {
  formatDate,
  calculateAge,
  formatCurrency,
  formatPhoneNumber,
  truncateText,
  getInitials,
  getColorFromName,
  isValidEmail,
  isValidPhone,
  validatePassword,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  getQueryParams,
  objectToQueryString,
  generateId,
  calculatePercentage,
  getFileExtension,
  formatFileSize,
  isEmpty,
  capitalizeWords,
  getStatusColorClass,
  sortByProperty,
  filterBySearch,
  groupBy,
};