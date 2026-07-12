import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';
import { LayoutDashboard, Navigation, ShieldCheck, BarChart3 } from 'lucide-react';

const AuthContext = createContext(null);

export const ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER',
  DISPATCHER: 'DISPATCHER',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST',
};

export const ROLE_LABELS = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const ROLE_DESCRIPTIONS = {
  FLEET_MANAGER: 'Full fleet oversight - vehicles, drivers, trips, maintenance, and analytics',
  DISPATCHER: 'Trip dispatching, driver assignment, vehicle allocation, and route management',
  SAFETY_OFFICER: 'Safety compliance, incident reporting, driver safety monitoring, and audits',
  FINANCIAL_ANALYST: 'Financial analytics, cost tracking, fuel expenses, and budget reporting',
};

export const ROLE_ICONS = {
  FLEET_MANAGER: LayoutDashboard,
  DISPATCHER: Navigation,
  SAFETY_OFFICER: ShieldCheck,
  FINANCIAL_ANALYST: BarChart3,
};

export const ROLE_PERMISSIONS = {
  FLEET_MANAGER: ['vehicles', 'drivers', 'trips', 'maintenance', 'fuel', 'expenses', 'analytics', 'reports', 'settings', 'users'],
  DISPATCHER: ['trips', 'vehicles', 'drivers', 'routes', 'dispatch'],
  SAFETY_OFFICER: ['drivers', 'trips', 'incidents', 'safety', 'audits', 'compliance'],
  FINANCIAL_ANALYST: ['expenses', 'fuel', 'analytics', 'reports', 'budgets', 'costs'],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Listen for auth:unauthorized events from axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      toast.error('Session expired. Please login again.');
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup({ name, email, password, role });
      const { user } = response.data;
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const hasAnyRole = useCallback((...roles) => {
    if (!user) return false;
    return roles.some(role => user.role === role);
  }, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  }, [user]);

  const isFleetManager = user?.role === ROLES.FLEET_MANAGER;
  const isDispatcher = user?.role === ROLES.DISPATCHER;
  const isSafetyOfficer = user?.role === ROLES.SAFETY_OFFICER;
  const isFinancialAnalyst = user?.role === ROLES.FINANCIAL_ANALYST;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
    isFleetManager,
    isDispatcher,
    isSafetyOfficer,
    isFinancialAnalyst,
    ROLES,
    ROLE_LABELS,
    ROLE_DESCRIPTIONS,
    ROLE_ICONS,
    ROLE_PERMISSIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
