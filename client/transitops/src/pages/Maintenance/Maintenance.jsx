import { useState, useEffect, useCallback } from 'react';
import { maintenanceAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  IndianRupee,
} from 'lucide-react';
import MaintenanceTable from './components/MaintenanceTable';
import AddMaintenanceModal from './components/AddMaintenanceModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', search: '' });

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      const response = await maintenanceAPI.getAll(params);
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to load maintenance logs:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to load maintenance logs');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Apply search filter locally
  useEffect(() => {
    let result = logs;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.vehicle?.name?.toLowerCase().includes(q) ||
          l.vehicle?.regNo?.toLowerCase().includes(q) ||
          l.serviceType?.toLowerCase().includes(q)
      );
    }
    setFilteredLogs(result);
  }, [logs, filters.search]);

  const handleClose = async (id) => {
    try {
      await maintenanceAPI.close(id);
      toast.success('Maintenance closed successfully');
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to close maintenance');
    }
  };

  const handleAdd = async (data) => {
    try {
      await maintenanceAPI.create(data);
      toast.success('Maintenance log created');
      setShowAddModal(false);
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create maintenance');
    }
  };

  // Stats
  const stats = {
    total: logs.length,
    open: logs.filter((l) => l.status === 'OPEN').length,
    closed: logs.filter((l) => l.status === 'CLOSED').length,
    totalCost: logs.reduce((sum, l) => sum + (l.cost || 0), 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Maintenance</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Track vehicle service and repair records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            New Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Records" value={stats.total} color="#729969" icon={Wrench} />
        <StatCard label="Open" value={stats.open} color="#F59E0B" icon={Clock} />
        <StatCard label="Closed" value={stats.closed} color="#10B981" icon={CheckCircle} />
        <StatCard label="Total Cost" value={`₹${stats.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} color="#EF4444" icon={IndianRupee} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text)]/40" />
          <input
            type="text"
            placeholder="Search vehicle, service type..."
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
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <MaintenanceTable
          logs={filteredLogs}
          onClose={handleClose}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddMaintenanceModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
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

export default Maintenance;
