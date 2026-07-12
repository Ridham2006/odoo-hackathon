import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Loader2,
  LogIn,
  Truck,
} from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registered) {
      toast.success('Account created successfully! Sign in to continue.', {
        duration: 5000,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.registered]);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : '';
      case 'password':
        return value.length < 1 ? 'Password is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Brand Header */}
      <div className="text-center mb-10">
        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 group-hover:shadow-xl group-hover:shadow-[var(--primary)]/30 transition-all duration-300 group-hover:scale-105">
            <Truck className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-bold text-[var(--accent)] tracking-tight">TransitOps</span>
        </Link>
        <h1 className="text-4xl font-bold text-[var(--text)] mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-[var(--text)]/50 text-lg">Sign in to manage your fleet operations</p>
      </div>

      {/* Sign In Card */}
      <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-[var(--card)] p-8 transition-all duration-300 hover:shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-200 outline-none ${
                  errors.email
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="john@company.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--text)]">
                Password
              </label>
              <button type="button" className="text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium transition-colors">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-200 outline-none ${
                  errors.password
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text)]/40 hover:text-[var(--text)]/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                formData.rememberMe
                  ? 'bg-[var(--primary)] border-[var(--primary)]'
                  : 'border-[var(--card)] group-hover:border-[var(--primary)]/50'
              }`}>
                {formData.rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </div>
            <span className="text-sm text-[var(--text)]/60 group-hover:text-[var(--text)]/80 transition-colors">
              Remember me for 30 days
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold text-base shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <LogIn className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-[var(--text)]/40 mt-8">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[var(--primary)] font-semibold hover:text-[var(--primary)]/80 transition-colors">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
