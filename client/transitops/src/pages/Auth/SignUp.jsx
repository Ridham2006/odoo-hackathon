import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_ICONS } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  CheckCheck,
  Loader2,
  ArrowRight,
  Truck,
} from 'lucide-react';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.FLEET_MANAGER,
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.FLEET_MANAGER);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signup(formData.name, formData.email, formData.password, formData.role);
    setIsLoading(false);

    if (result.success) {
      toast.success('Account created successfully!', {
        description: `Welcome aboard! Sign in to continue as ${ROLE_LABELS[formData.role]}.`,
        duration: 5000,
      });
      navigate('/login', { state: { registered: true, email: formData.email } });
    } else {
      toast.error(result.error || 'Signup failed. Please try again.');
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '', width: '0%' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const width = `${(score / 5) * 100}%`;
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500', width };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600', width };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600', width };
    return { score, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600', width };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-3 text-3xl font-bold text-[var(--accent)] mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 transition-all duration-300 group-hover:scale-110">
            <Truck className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <span className="tracking-tight">TransitOps</span>
        </Link>
        <h1 className="text-4xl font-bold text-[var(--text)] mb-2 tracking-tight">Create Your Account</h1>
        <p className="text-lg text-[var(--text)]/50">Choose your role and start managing your fleet</p>
      </div>

      {/* Sign Up Card */}
      <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-[var(--card)] p-8 transition-all duration-300 hover:shadow-xl">
        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text)]/60 uppercase tracking-wider mb-4">Select Your Role</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ROLES).map(([key, value]) => {
              const IconComponent = ROLE_ICONS[value];
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleSelect(value)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    selectedRole === value
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm shadow-[var(--primary)]/10'
                      : 'border-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--background)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={selectedRole === value}
                    onChange={() => handleRoleSelect(value)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <span className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      selectedRole === value
                        ? 'bg-[var(--primary)]/10 scale-110'
                        : 'bg-[var(--background)] group-hover:bg-[var(--card)]'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        selectedRole === value ? 'text-[var(--primary)]' : 'text-[var(--text)]/60'
                      }`} strokeWidth={1.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--text)]">{ROLE_LABELS[value]}</div>
                      <div className="text-xs text-[var(--text)]/40 mt-0.5 leading-tight">{ROLE_DESCRIPTIONS[value]}</div>
                    </div>
                    {selectedRole === value && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-sm animate-scale-in">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-200 outline-none ${
                  errors.name
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="John Doe"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-200 outline-none ${
                  errors.email
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="you@company.com"
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
            <label htmlFor="signup-password" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
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
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text)]/40 hover:text-[var(--text)]/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            
            {/* Password Strength Bar */}
            {formData.password && (
              <div className="mt-2 space-y-1.5 animate-slide-down">
                <div className="h-1.5 rounded-full bg-[var(--card)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text)]/40">
                    Strength: <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : 'bg-[var(--card)]'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text)]/40">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-200 outline-none ${
                  errors.confirmPassword
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-400 bg-green-50/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                      : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text)]/40 hover:text-[var(--text)]/70 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
              {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                <div className="absolute inset-y-0 right-12 pr-4 flex items-center text-green-500">
                  <CheckCheck className="w-5 h-5" />
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                formData.agreeTerms
                  ? 'bg-[var(--primary)] border-[var(--primary)]'
                  : errors.agreeTerms
                    ? 'border-red-400 group-hover:border-red-500'
                    : 'border-[var(--card)] group-hover:border-[var(--primary)]/50'
              }`}>
                {formData.agreeTerms && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm text-[var(--text)]/60 group-hover:text-[var(--text)]/80 transition-colors">
                I agree to the{' '}
                <button type="button" className="text-[var(--primary)] font-medium hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-[var(--primary)] font-medium hover:underline">Privacy Policy</button>
              </span>
              {errors.agreeTerms && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.agreeTerms}
                </p>
              )}
            </div>
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
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Sign In Link */}
      <p className="text-center text-sm text-[var(--text)]/40 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--primary)] font-semibold hover:text-[var(--primary)]/80 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
