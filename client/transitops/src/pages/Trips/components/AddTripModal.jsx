import { useState, useEffect } from 'react';
import { X, Save, MapPin, Package, Gauge, Search, Loader2 } from 'lucide-react';
import { vehicleAPI, driverAPI } from '../../../services/api';

const initialFormState = {
  source: '',
  destination: '',
  vehicle: '',
  driver: '',
  cargoWeight: '',
  plannedDistance: '',
};

const AddTripModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Fetch available vehicles & drivers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [vehRes, drvRes] = await Promise.all([
          vehicleAPI.getAll(),
          driverAPI.getAll(),
        ]);
        setVehicles(vehRes.data.filter((v) => v.status === 'AVAILABLE'));
        setDrivers(drvRes.data.filter((d) => d.status === 'AVAILABLE'));
      } catch (err) {
        console.error('Failed to load vehicles/drivers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.vehicle) newErrors.vehicle = 'Please select a vehicle';
    if (!formData.driver) newErrors.driver = 'Please select a driver';
    if (!formData.cargoWeight || Number(formData.cargoWeight) <= 0) {
      newErrors.cargoWeight = 'Enter valid cargo weight';
    }
    if (!formData.plannedDistance || Number(formData.plannedDistance) <= 0) {
      newErrors.plannedDistance = 'Enter valid distance';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await onSave({
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      vehicle: formData.vehicle,
      driver: formData.driver,
      cargoWeight: Number(formData.cargoWeight),
      plannedDistance: Number(formData.plannedDistance),
    });
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const selectedVehicle = vehicles.find((v) => v._id === formData.vehicle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--accent)]">
              Create New Trip
            </h2>
            <p className="text-sm text-[var(--text)]/50 mt-0.5">
              Assign a vehicle and driver for this route
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
              <span className="ml-3 text-[var(--text)]/50">Loading available resources...</span>
            </div>
          ) : (
            <>
              {/* Route Section */}
              <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
                <h3 className="text-sm font-semibold text-[var(--text)]/60 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Route Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Source</label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="e.g., Ahmedabad"
                      className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                        errors.source ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                      }`}
                    />
                    {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Destination</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g., Surat"
                      className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                        errors.destination ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                      }`}
                    />
                    {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver Section */}
              <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
                <h3 className="text-sm font-semibold text-[var(--text)]/60 mb-3">Assignment</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Vehicle Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Vehicle</label>
                    {vehicles.length === 0 ? (
                      <p className="text-sm text-red-400 bg-red-50 px-4 py-3 rounded-2xl">No available vehicles</p>
                    ) : (
                      <select
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${
                          errors.vehicle ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                        }`}
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name} ({v.regNo}) — {v.type} — {v.capacity}kg
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.vehicle && <p className="mt-1 text-xs text-red-500">{errors.vehicle}</p>}
                    {selectedVehicle && (
                      <div className="mt-2 flex gap-2 text-xs text-[var(--text)]/50">
                        <span className="bg-[var(--background)] px-2 py-1 rounded-lg">
                          Cap: {selectedVehicle.capacity}kg
                        </span>
                        <span className="bg-[var(--background)] px-2 py-1 rounded-lg">
                          Type: {selectedVehicle.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Driver Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Driver</label>
                    {drivers.length === 0 ? (
                      <p className="text-sm text-red-400 bg-red-50 px-4 py-3 rounded-2xl">No available drivers</p>
                    ) : (
                      <select
                        name="driver"
                        value={formData.driver}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${
                          errors.driver ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                        }`}
                      >
                        <option value="">Select a driver</option>
                        {drivers.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} — {d.licenseNo} — {d.category}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.driver && <p className="mt-1 text-xs text-red-500">{errors.driver}</p>}
                  </div>
                </div>
              </div>

              {/* Load Section */}
              <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
                <h3 className="text-sm font-semibold text-[var(--text)]/60 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Load & Distance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Cargo Weight (kg)</label>
                    <div className="relative">
                      <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                      <input
                        type="number"
                        name="cargoWeight"
                        value={formData.cargoWeight}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g., 500"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                          errors.cargoWeight ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                        }`}
                      />
                    </div>
                    {errors.cargoWeight && <p className="mt-1 text-xs text-red-500">{errors.cargoWeight}</p>}
                    {selectedVehicle && Number(formData.cargoWeight) > selectedVehicle.capacity && (
                      <p className="mt-1 text-xs text-amber-500">
                        ⚠️ Exceeds vehicle capacity ({selectedVehicle.capacity}kg)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Planned Distance (km)</label>
                    <div className="relative">
                      <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
                      <input
                        type="number"
                        name="plannedDistance"
                        value={formData.plannedDistance}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g., 200"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none transition-all duration-200 ${
                          errors.plannedDistance ? 'border-red-400 bg-red-50/50' : 'border-[var(--card)] bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                        }`}
                      />
                    </div>
                    {errors.plannedDistance && <p className="mt-1 text-xs text-red-500">{errors.plannedDistance}</p>}
                  </div>
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
                  disabled={isSaving || isLoading}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Creating...' : 'Create Trip'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTripModal;
