import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { driverAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';
import DriverTable from './components/DriverTable';
import SafetyProfile from './components/SafetyProfile';
import AddDriverModal from './components/AddDriverModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TABS = [
  { id: 'drivers', label: 'Driver List', icon: Users },
  { id: 'safety', label: 'Safety Profile', icon: ShieldCheck },
];

const Drivers = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const { isFleetManager, isSafetyOfficer } = useAuth();

  const canManage = isFleetManager;
  const canView = isFleetManager || isSafetyOfficer;

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      const response = await driverAPI.getAll(params);
      const data = response.data;
      setDrivers(data);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    if (canView) fetchDrivers();
  }, [fetchDrivers, canView]);

  // Apply search filter locally
  useEffect(() => {
    let result = drivers;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.licenseNo?.toLowerCase().includes(q) ||
          d.contact?.includes(q) ||
          d.category?.toLowerCase().includes(q)
      );
    }
    setFilteredDrivers(result);
  }, [drivers, filters.search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    try {
      await driverAPI.delete(id);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete driver');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingDriver(null);
  };

  const handleSave = async (data) => {
    try {
      if (editingDriver) {
        await driverAPI.update(editingDriver._id, data);
        toast.success('Driver updated successfully');
      } else {
        await driverAPI.create(data);
        toast.success('Driver added successfully');
      }
      handleModalClose();
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  // Stats from driver data
  const stats = {
    total: drivers.length,
    available: drivers.filter((d) => d.status === 'AVAILABLE').length,
    onTrip: drivers.filter((d) => d.status === 'ON_TRIP').length,
    offDuty: drivers.filter((d) => d.status === 'OFF_DUTY').length,
    suspended: drivers.filter((d) => d.status === 'SUSPENDED').length,
    goodSafety: drivers.filter((d) => d.safetyStatus === 'Good').length,
  };

  if (!canView) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Access Restricted</h2>
          <p className="text-[var(--text)]/50">
            Only Fleet Managers and Safety Officers can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Drivers & Safety Profile</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Manage driver records, licenses, and safety compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDrivers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <UserPlus className="w-5 h-5" />
              Add Driver
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Drivers" value={stats.total} color="#729969" />
        <StatCard label="Available" value={stats.available} color="#3B82F6" />
        <StatCard label="On Trip" value={stats.onTrip} color="#F59E0B" />
        <StatCard label="Off Duty" value={stats.offDuty} color="#6B7280" />
        <StatCard label="Safe Status" value={stats.goodSafety} color="#10B981" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[var(--card)]/50 border border-[var(--card)] w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-[var(--primary)] shadow-sm'
                  : 'text-[var(--text)]/50 hover:text-[var(--text)]/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text)]/40" />
          <input
            type="text"
            placeholder="Search name, license, contact..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="pl-10 pr-8 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {activeTab === 'drivers' && (
            <DriverTable
              drivers={filteredDrivers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canManage={canManage}
            />
          )}
          {activeTab === 'safety' && (
            <SafetyProfile
              drivers={filteredDrivers}
            />
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddDriverModal
          driver={editingDriver}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl p-4 border border-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-medium text-[var(--text)]/50 uppercase tracking-wider">{label}</p>
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
    <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
  </div>
);

export default Drivers;
