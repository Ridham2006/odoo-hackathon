import { useState, useEffect } from 'react';
import { X, Save, IndianRupee, Truck, MapPin, Wrench, Receipt, Loader2 } from 'lucide-react';
import { vehicleAPI, tripAPI } from '../../../services/api';

const initialFormState = {
  vehicle: '',
  trip: '',
  toll: '',
  other: '',
  maintenance: '',
};

const AddExpenseModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehRes, tripRes] = await Promise.all([
          vehicleAPI.getAll(),
          tripAPI.getAll(),
        ]);
        setVehicles(vehRes.data);
        setTrips(tripRes.data.filter((t) => t.status === 'COMPLETED' || t.status === 'DISPATCHED'));
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicle) newErrors.vehicle = 'Please select a vehicle';
    if ((!formData.toll || Number(formData.toll) <= 0) && (!formData.other || Number(formData.other) <= 0)) {
      newErrors.toll = 'Enter at least toll or other expense';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await onSave({
      vehicle: formData.vehicle,
      trip: formData.trip || undefined,
      toll: Number(formData.toll) || 0,
      other: Number(formData.other) || 0,
    });
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const estimatedTotal = (Number(formData.toll) || 0) + (Number(formData.other) || 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-[var(--accent)]">Add Expense</h2>
            </div>
            <p className="text-sm text-[var(--text)]/50 mt-0.5">Record toll, misc, or trip expenses</p>
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
              <span className="ml-3 text-[var(--text)]/50">Loading...</span>
            </div>
          ) : (
            <>
              {/* Vehicle */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Vehicle *</label>
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
                        {v.name} ({v.regNo})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.vehicle && <p className="mt-1 text-xs text-red-500">{errors.vehicle}</p>}
              </div>

              {/* Trip (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
                  Trip <span className="text-[var(--text)]/40 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                  <select
                    name="trip"
                    value={formData.trip}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">No trip linked</option>
                    {trips.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.tripNo} — {t.source} → {t.destination}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amounts */}
              <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
                <h3 className="text-sm font-semibold text-[var(--text)]/60 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Amount Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Toll Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      <input
                        type="number"
                        name="toll"
                        value={formData.toll}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                          errors.toll ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
                      Other <span className="text-[var(--text)]/40 font-normal">(misc)</span>
                    </label>
                    <div className="relative">
                      <Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="number"
                        name="other"
                        value={formData.other}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Total */}
              {estimatedTotal > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-4 border border-red-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text)]/70">Estimated Total</span>
                    <span className="text-xl font-bold text-[var(--accent)]">{formatCurrency(estimatedTotal)}</span>
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
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
