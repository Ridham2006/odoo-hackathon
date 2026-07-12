import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const initialFormState = {
  name: '',
  licenseNo: '',
  category: '',
  expiry: '',
  contact: '',
  tripCompleted: 0,
  safetyStatus: 'Good',
  status: 'AVAILABLE',
};

const AddDriverModal = ({ driver, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!driver;

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        licenseNo: driver.licenseNo || '',
        category: driver.category || '',
        expiry: driver.expiry ? new Date(driver.expiry).toISOString().split('T')[0] : '',
        contact: driver.contact || '',
        tripCompleted: driver.tripCompleted || 0,
        safetyStatus: driver.safetyStatus || 'Good',
        status: driver.status || 'AVAILABLE',
      });
    }
  }, [driver]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.licenseNo.trim()) newErrors.licenseNo = 'License number is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    else if (!/^[\d\s+\-()]{7,15}$/.test(formData.contact)) newErrors.contact = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await onSave({
      ...formData,
      expiry: new Date(formData.expiry).toISOString(),
      tripCompleted: Number(formData.tripCompleted),
    });
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--accent)]">
              {isEditing ? 'Edit Driver' : 'Add New Driver'}
            </h2>
            <p className="text-sm text-[var(--text)]/50 mt-0.5">
              {isEditing ? 'Update driver information' : 'Enter the details of the new driver'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--card)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text)]/50" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* License No */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">License Number</label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.licenseNo ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="GJ01 2024 12345"
              />
              {errors.licenseNo && <p className="mt-1 text-xs text-red-500">{errors.licenseNo}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.category ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="Heavy Vehicle"
              />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Contact Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.contact ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                placeholder="+91 98765 43210"
              />
              {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">License Expiry</label>
              <input
                type="date"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.expiry ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
              />
              {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--card)] bg-[var(--background)]/50 outline-none focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="OFF_DUTY">Off Duty</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* Safety Status */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Safety Status</label>
              <div className="flex gap-3">
                {['Good', 'Average', 'Poor'].map((status) => (
                  <label
                    key={status}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.safetyStatus === status
                        ? status === 'Good'
                          ? 'border-green-400 bg-green-50'
                          : status === 'Average'
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-red-400 bg-red-50'
                        : 'border-[var(--card)] hover:border-[var(--primary)]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="safetyStatus"
                      value={status}
                      checked={formData.safetyStatus === status}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      status === 'Good' ? 'bg-green-500' : status === 'Average' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trip Completed */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Trips Completed</label>
              <input
                type="number"
                name="tripCompleted"
                value={formData.tripCompleted}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--card)] bg-[var(--background)]/50 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-2xl border-2 border-[var(--card)] font-semibold text-[var(--text)]/60 hover:bg-[var(--background)] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : isEditing ? 'Update Driver' : 'Add Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;
