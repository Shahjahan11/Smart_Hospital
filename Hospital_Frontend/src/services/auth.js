import apiService from './api';
import { endpoints } from './endpoints';

const authService = {
  login: async (email, password) => {
    try {
      const response = await apiService.post(endpoints.auth.login, {
        email,
        password,
      });
      
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiService.post(endpoints.auth.register, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiService.get(endpoints.auth.me);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to get user info' 
      };
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post(endpoints.auth.refreshToken, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return { success: true, data: response.data };
    } catch (error) {
      this.logout();
      return { 
        success: false, 
        error: 'Session expired. Please login again.' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiService.put(endpoints.auth.profile, userData);
      
      const updatedUser = { ...authService.getUser(), ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update profile' 
      };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiService.post(endpoints.auth.changePassword, {
        currentPassword,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to change password' 
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiService.post(endpoints.auth.forgotPassword, {
        email,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to send reset email' 
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post(endpoints.auth.resetPassword, {
        token,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to reset password' 
      };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await apiService.post(endpoints.auth.verifyEmail, {
        token,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to verify email' 
      };
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await apiService.post(endpoints.auth.resendVerification, {
        email,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to resend verification' 
      };
    }
  },
};

export default authService;