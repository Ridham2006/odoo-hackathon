import { useState, useEffect } from 'react';
import { X, Save, Truck, Weight, Gauge, IndianRupee } from 'lucide-react';

const initialFormState = {
  regNo: '',
  name: '',
  type: '',
  capacity: '',
  odometer: 0,
  acqCost: '',
  status: 'AVAILABLE',
};

const AddVehicleModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setFormData({
        regNo: vehicle.regNo || '',
        name: vehicle.name || '',
        type: vehicle.type || '',
        capacity: vehicle.capacity || '',
        odometer: vehicle.odometer || 0,
        acqCost: vehicle.acqCost || '',
        status: vehicle.status || 'AVAILABLE',
      });
    }
  }, [vehicle]);

  const validate = () => {
    const newErrors = {};
    if (!formData.regNo.trim()) newErrors.regNo = 'Registration number is required';
    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.type.trim()) newErrors.type = 'Type is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) newErrors.capacity = 'Enter valid capacity';
    if (!formData.acqCost || Number(formData.acqCost) <= 0) newErrors.acqCost = 'Enter valid cost';
    if (!isEditing && formData.odometer < 0) newErrors.odometer = 'Invalid odometer';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await onSave({
      ...formData,
      regNo: formData.regNo.toUpperCase(),
      capacity: Number(formData.capacity),
      odometer: Number(formData.odometer),
      acqCost: Number(formData.acqCost),
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--accent)]">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <p className="text-sm text-[var(--text)]/50 mt-0.5">
              {isEditing ? 'Update vehicle information' : 'Enter the details of the new vehicle'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--card)] transition-colors">
            <X className="w-5 h-5 text-[var(--text)]/50" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Registration */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Registration No *</label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                placeholder="e.g., GJ01AB1234"
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 uppercase ${
                  errors.regNo ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
                disabled={isEditing}
              />
              {errors.regNo && <p className="mt-1 text-xs text-red-500">{errors.regNo}</p>}
            </div>

            {/* Name */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Vehicle Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., VAN-05"
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${
                  errors.type ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                }`}
              >
                <option value="">Select type</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Mini">Mini</option>
                <option value="Bus">Bus</option>
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
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
                <option value="IN_SHOP">In Shop</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Capacity (kg) *</label>
              <div className="relative">
                <Weight className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 500"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                    errors.capacity ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  }`}
                />
              </div>
              {errors.capacity && <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>}
            </div>

            {/* Odometer */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Odometer (km)</label>
              <div className="relative">
                <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 0"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[var(--card)] bg-[var(--background)]/50 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Acquisition Cost */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Acquisition Cost (₹) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                <input
                  type="number"
                  name="acqCost"
                  value={formData.acqCost}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 500000"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                    errors.acqCost ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-[var(--background)]/50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  }`}
                />
              </div>
              {errors.acqCost && <p className="mt-1 text-xs text-red-500">{errors.acqCost}</p>}
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
              {isSaving ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
