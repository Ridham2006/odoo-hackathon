import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tripAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  Route,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import TripTable from './components/TripTable';
import AddTripModal from './components/AddTripModal';
import TripDetailsModal from './components/TripDetailsModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TRIP_TABS = [
  { id: 'all', label: 'All Trips', icon: Route },
  { id: 'active', label: 'Active', icon: Send },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
  { id: 'draft', label: 'Drafts', icon: Clock },
];

const Trips = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const { isDispatcher, isFleetManager, isSafetyOfficer } = useAuth();

  const canManage = isDispatcher || isFleetManager;
  const canView = canManage || isSafetyOfficer;

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      const response = await tripAPI.getAll(params);
      setTrips(response.data);
    } catch (err) {
      console.error('Failed to load trips:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    if (canView) fetchTrips();
  }, [fetchTrips, canView]);

  // Apply tab & search filter locally
  useEffect(() => {
    let result = trips;

    // Tab filter
    if (activeTab === 'active') {
      result = result.filter((t) => t.status === 'DISPATCHED');
    } else if (activeTab === 'completed') {
      result = result.filter((t) => t.status === 'COMPLETED');
    } else if (activeTab === 'draft') {
      result = result.filter((t) => t.status === 'DRAFT');
    }

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.tripNo?.toLowerCase().includes(q) ||
          t.source?.toLowerCase().includes(q) ||
          t.destination?.toLowerCase().includes(q) ||
          t.vehicle?.name?.toLowerCase().includes(q) ||
          t.vehicle?.regNo?.toLowerCase().includes(q) ||
          t.driver?.name?.toLowerCase().includes(q)
      );
    }

    setFilteredTrips(result);
  }, [trips, filters.search, activeTab]);

  const handleCreate = async (data) => {
    try {
      await tripAPI.create(data);
      toast.success('Trip created successfully');
      setShowAddModal(false);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create trip');
    }
  };

  const handleDispatch = async () => {
    if (!selectedTrip) return;
    setIsProcessing(true);
    try {
      await tripAPI.dispatch(selectedTrip._id);
      toast.success('Trip dispatched successfully!');
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to dispatch trip');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedTrip) return;
    setIsProcessing(true);
    try {
      await tripAPI.complete(selectedTrip._id);
      toast.success('Trip completed successfully!');
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete trip');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedTrip) return;
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    setIsProcessing(true);
    try {
      await tripAPI.cancel(selectedTrip._id);
      toast.success('Trip cancelled');
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel trip');
    } finally {
      setIsProcessing(false);
    }
  };

  // Stats
  const stats = {
    total: trips.length,
    dispatched: trips.filter((t) => t.status === 'DISPATCHED').length,
    completed: trips.filter((t) => t.status === 'COMPLETED').length,
    draft: trips.filter((t) => t.status === 'DRAFT').length,
    cancelled: trips.filter((t) => t.status === 'CANCELLED').length,
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
            You don't have permission to view trips. Contact your fleet manager.
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
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Trips Management</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Create, dispatch, and manage all fleet trips
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTrips}
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
              <Plus className="w-5 h-5" />
              New Trip
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Trips" value={stats.total} color="#729969" icon={Route} />
        <StatCard label="Active (Dispatched)" value={stats.dispatched} color="#3B82F6" icon={Send} />
        <StatCard label="Completed" value={stats.completed} color="#10B981" icon={CheckCircle} />
        <StatCard label="Drafts" value={stats.draft} color="#6B7280" icon={Clock} />
        <StatCard label="Cancelled" value={stats.cancelled} color="#EF4444" icon={AlertTriangle} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[var(--card)]/50 border border-[var(--card)] w-fit">
        {TRIP_TABS.map((tab) => {
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
            placeholder="Search trip no, route, vehicle, driver..."
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
            <option value="DRAFT">Draft</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <TripTable
          trips={filteredTrips}
          onViewDetails={setSelectedTrip}
          canManage={canManage}
        />
      )}

      {/* Create Trip Modal */}
      {showAddModal && (
        <AddTripModal
          onClose={() => setShowAddModal(false)}
          onSave={handleCreate}
        />
      )}

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onDispatch={handleDispatch}
          onComplete={handleComplete}
          onCancel={handleCancel}
          isProcessing={isProcessing}
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

export default Trips;
