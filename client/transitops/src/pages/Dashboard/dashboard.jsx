import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  TrendingUp,
  Truck,
  Route,
  Users,
  Wrench,
  Clock,
  RefreshCw,
  MapPin,
  CheckCircle,
  Send,
  XCircle,
  Activity,
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [tripStatusDistribution, setTripStatus] = useState([]);
  const [vehicleStatusData, setVehicleStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Only fetch KPIs - these are available to all authenticated users
      const kpiRes = await analyticsAPI.getDashboardKPIs();
      setKpis(kpiRes.data);
      
      // Optional: fetch trip/vehicle status analytics (may fail for some roles, silently handled)
      try {
        const tripRes = await analyticsAPI.getTripStatus();
        setTripStatus(tripRes.data || []);
      } catch {}
      
      try {
        const vehRes = await analyticsAPI.getVehicleStatus();
        setVehicleStatus(vehRes.data || []);
      } catch {}
    } catch (err) {
      console.error('Dashboard fetch error:', err?.response?.data?.error || err.message);
      // Show the actual error from server if available
      toast.error(err?.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate status percentages for vehicle status chart
  const totalVehicles = kpis?.totalVehicles || 1;
  const vehicleStats = [
    { name: 'Available', value: kpis?.availableVehicles || 0, color: '#10B981', percentage: Math.round(((kpis?.availableVehicles || 0) / totalVehicles) * 100) },
    { name: 'On Trip', value: kpis?.activeVehicles || 0, color: '#3B82F6', percentage: Math.round(((kpis?.activeVehicles || 0) / totalVehicles) * 100) },
    { name: 'In Shop', value: kpis?.inShopVehicles || 0, color: '#F59E0B', percentage: Math.round(((kpis?.inShopVehicles || 0) / totalVehicles) * 100) },
    { name: 'Retired', value: Math.max(0, totalVehicles - (kpis?.availableVehicles || 0) - (kpis?.activeVehicles || 0) - (kpis?.inShopVehicles || 0)), color: '#6B7280', percentage: 0 },
  ];
  // Recalculate retired percentage
  vehicleStats[3].percentage = Math.round(((vehicleStats[3].value) / totalVehicles) * 100);

  const tripStatusLabels = {
    DRAFT: { label: 'Draft', color: '#6B7280', icon: Clock },
    DISPATCHED: { label: 'Active', color: '#3B82F6', icon: Send },
    COMPLETED: { label: 'Completed', color: '#10B981', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', icon: XCircle },
  };

  // Build trip status summary from distribution data
  const tripStatusSummary = tripStatusDistribution.length > 0
    ? tripStatusDistribution.map((t) => ({
        _id: t._id,
        status: t._id,
        count: t.count,
      }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Dashboard</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Real-time fleet overview and key metrics
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KpiCard icon={Truck} title="Total Vehicles" value={kpis?.totalVehicles || 0} color="#729969" />
        <KpiCard icon={Activity} title="Active" value={kpis?.activeVehicles || 0} color="#3B82F6" />
        <KpiCard icon={TrendingUp} title="Available" value={kpis?.availableVehicles || 0} color="#10B981" />
        <KpiCard icon={Wrench} title="In Shop" value={kpis?.inShopVehicles || 0} color="#F59E0B" />
        <KpiCard icon={Route} title="Active Trips" value={kpis?.activeTrips || 0} color="#3B82F6" />
        <KpiCard icon={Clock} title="Pending" value={kpis?.pendingTrips || 0} color="#8B5CF6" />
        <KpiCard icon={TrendingUp} title="Utilization" value={`${kpis?.fleetUtilization || 0}%`} color="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--card)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
              <Route className="w-5 h-5 text-[var(--primary)]" />
              Trip Overview
            </h2>
          </div>

          {tripStatusSummary.length > 0 ? (
            <div className="space-y-3">
              {tripStatusSummary.map((item) => {
                const config = tripStatusLabels[item._id] || { label: item._id, color: '#6B7280', icon: MapPin };
                const Icon = config.icon;
                const total = tripStatusSummary.reduce((s, i) => s + i.count, 0) || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item._id} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background)]/30 hover:bg-[var(--background)]/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--text)]">{config.label}</span>
                        <span className="text-sm font-bold text-[var(--accent)]">{item.count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--card)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: config.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <Route className="w-8 h-8 text-[var(--text)]/20 mx-auto mb-2" />
                <p className="text-sm text-[var(--text)]/40">No trip data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-5 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[var(--primary)]" />
            Vehicle Status
          </h2>

          <div className="space-y-5">
            {vehicleStats.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-[var(--text)]/70">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--accent)]">{item.value}</span>
                    <span className="text-xs text-[var(--text)]/40">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-[var(--card)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Drivers on duty */}
          <div className="mt-6 pt-5 border-t border-[var(--card)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm text-[var(--text)]/60">Drivers On Duty</span>
              </div>
              <span className="text-lg font-bold text-[var(--accent)]">{kpis?.driversOnDuty || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-2xl p-4 border border-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-medium text-[var(--text)]/50 uppercase tracking-wider">{title}</p>
      {Icon && <Icon className="w-4 h-4" style={{ color }} />}
    </div>
    <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
  </div>
);

export default Dashboard;
