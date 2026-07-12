import { useState, useEffect } from 'react';
import { X, Save, Fuel, Truck, Droplets, IndianRupee, Loader2 } from 'lucide-react';
import { vehicleAPI } from '../../../services/api';

const initialFormState = {
  vehicle: '',
  liters: '',
  fuelCost: '',
  date: new Date().toISOString().split('T')[0],
};

const AddFuelLogModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehicleAPI.getAll();
        setVehicles(res.data);
      } catch (err) {
        console.error('Failed to load vehicles', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicle) newErrors.vehicle = 'Please select a vehicle';
    if (!formData.liters || Number(formData.liters) <= 0) newErrors.liters = 'Enter valid liters';
    if (!formData.fuelCost || Number(formData.fuelCost) <= 0) newErrors.fuelCost = 'Enter valid cost';
    if (!formData.date) newErrors.date = 'Select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await onSave({
      vehicle: formData.vehicle,
      liters: Number(formData.liters),
      fuelCost: Number(formData.fuelCost),
      date: new Date(formData.date).toISOString(),
    });
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const rate =
    formData.liters && Number(formData.liters) > 0 && formData.fuelCost
      ? (Number(formData.fuelCost) / Number(formData.liters)).toFixed(2)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div>
            <div className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-[var(--accent)]">Add Fuel Log</h2>
            </div>
            <p className="text-sm text-[var(--text)]/50 mt-0.5">Record a vehicle refueling</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--card)] transition-colors">
            <X className="w-5 h-5 text-[var(--text)]/50" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
              <span className="ml-3 text-[var(--text)]/50">Loading vehicles...</span>
            </div>
          ) : (
            <>
              {/* Vehicle */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Vehicle</label>
                <div className="relative">
                  <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${
                      errors.vehicle ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                    }`}
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.regNo}) — {v.type}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.vehicle && <p className="mt-1 text-xs text-red-500">{errors.vehicle}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                    errors.date ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                  }`}
                />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
              </div>

              {/* Liters & Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Liters</label>
                  <div className="relative">
                    <Droplets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <input
                      type="number"
                      name="liters"
                      value={formData.liters}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      placeholder="e.g., 45.5"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                        errors.liters ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                      }`}
                    />
                  </div>
                  {errors.liters && <p className="mt-1 text-xs text-red-500">{errors.liters}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Fuel Cost (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                    <input
                      type="number"
                      name="fuelCost"
                      value={formData.fuelCost}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g., 4500"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                        errors.fuelCost ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                      }`}
                    />
                  </div>
                  {errors.fuelCost && <p className="mt-1 text-xs text-red-500">{errors.fuelCost}</p>}
                </div>
              </div>

              {/* Auto-calculated Rate */}
              {rate && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-700">Fuel Rate</span>
                    <span className="text-lg font-bold text-amber-700">₹{rate}/L</span>
                  </div>
                </div>
              )}

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
                  disabled={isSaving || isLoading}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Add Fuel Log'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddFuelLogModal;
