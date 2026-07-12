import { useState, useEffect, useCallback } from 'react';
import { vehicleAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  Truck,
  RefreshCw,
  Plus,
  Search,
  AlertTriangle,
  Wrench,
  Activity,
  TrendingUp,
} from 'lucide-react';
import VehicleTable from '../../components/fleet/VehicleTable';
import FleetFilters from '../../components/fleet/FleetFilters';
import AddVehicleModal from '../../components/fleet/AddVehicleModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      const response = await vehicleAPI.getAll(params);
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to load vehicles:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.type]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Apply search filter locally
  useEffect(() => {
    let result = vehicles;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.regNo?.toLowerCase().includes(q) ||
          v.type?.toLowerCase().includes(q)
      );
    }
    setFilteredVehicles(result);
  }, [vehicles, filters.search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleAPI.delete(id);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingVehicle(null);
  };

  const handleSave = async (data) => {
    try {
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle._id, data);
        toast.success('Vehicle updated successfully');
      } else {
        await vehicleAPI.create(data);
        toast.success('Vehicle added successfully');
      }
      handleModalClose();
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  // Stats from vehicle data
  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === 'ON_TRIP').length,
    available: vehicles.filter((v) => v.status === 'AVAILABLE').length,
    inShop: vehicles.filter((v) => v.status === 'IN_SHOP').length,
    retired: vehicles.filter((v) => v.status === 'RETIRED').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Vehicle Registry</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Manage all fleet vehicles from one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVehicles}
            disabled={isLoading}
            className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Vehicles" value={stats.total} color="#729969" icon={Truck} />
        <StatCard label="Active (On Trip)" value={stats.active} color="#3B82F6" icon={Activity} />
        <StatCard label="Available" value={stats.available} color="#10B981" icon={TrendingUp} />
        <StatCard label="In Shop" value={stats.inShop} color="#F59E0B" icon={Wrench} />
        <StatCard label="Retired" value={stats.retired} color="#6B7280" icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <FleetFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <VehicleTable
          vehicles={filteredVehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddVehicleModal
          vehicle={editingVehicle}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-4 border border-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-medium text-[var(--text)]/50 uppercase tracking-wider">{label}</p>
      {Icon && <Icon className="w-4 h-4" style={{ color }} />}
    </div>
    <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
  </div>
);

export default Fleet;
