import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  BarChart3,
  RefreshCw,
  Truck,
  Route,
  Users,
  Fuel,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Activity,
  Wrench,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const PIE_COLORS = ['#729969', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280', '#10B981'];
const CHART_COLORS = ['#729969', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981'];

const statusLabels = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[var(--card)] p-3 text-sm">
        <p className="font-semibold text-[var(--text)] mb-1">{label || payload[0].name}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [tripStatus, setTripStatus] = useState([]);
  const [monthlyFuel, setMonthlyFuel] = useState([]);
  const [driverStatus, setDriverStatus] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState(null);
  const { isFleetManager, isFinancialAnalyst } = useAuth();

  const canViewFull = isFleetManager || isFinancialAnalyst;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  // Helper to safely fetch and return data or fallback
  const safeFetch = async (apiCall, fallback = null) => {
    try {
      const res = await apiCall;
      return res.data;
    } catch {
      return fallback;
    }
  };

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const kpiRes = await safeFetch(analyticsAPI.getDashboardKPIs(), {});
      setKpis(kpiRes);

      if (canViewFull) {
        const [
          analyticsData,
          vehicleStatusData,
          tripStatusData,
          monthlyFuelData,
          driverStatusData,
          expenseData,
        ] = await Promise.all([
          safeFetch(analyticsAPI.getAnalytics()),
          safeFetch(analyticsAPI.getVehicleStatus(), []),
          safeFetch(analyticsAPI.getTripStatus(), []),
          safeFetch(analyticsAPI.getMonthlyFuel(), []),
          safeFetch(analyticsAPI.getDriverStatus(), []),
          safeFetch(analyticsAPI.getExpenseBreakdown()),
        ]);

        setAnalytics(analyticsData);
        setVehicleStatus(vehicleStatusData);
        setTripStatus(tripStatusData);
        
        // Format monthly fuel data
        const fuelData = (monthlyFuelData || []).map((d) => ({
          ...d,
          month: new Date(d._id.year, d._id.month - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
          totalFuelCost: d.totalFuelCost || 0,
          totalLiters: d.totalLiters || 0,
        }));
        setMonthlyFuel(fuelData);

        setDriverStatus(driverStatusData);
        setExpenseBreakdown(expenseData);
      }
    } catch (err) {
      console.error('Failed to load some analytics:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to load some analytics');
    } finally {
      setIsLoading(false);
    }
  }, [canViewFull]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (!canViewFull) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Access Restricted</h2>
          <p className="text-[var(--text)]/50">
            Only Fleet Managers and Financial Analysts can access analytics.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Prepare chart data
  const vehiclePieData = vehicleStatus.map((d) => ({
    name: statusLabels[d._id] || d._id,
    value: d.count,
    color: PIE_COLORS[['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'].indexOf(d._id) % PIE_COLORS.length],
  }));

  const tripPieData = tripStatus.map((d) => ({
    name: statusLabels[d._id] || d._id,
    value: d.count,
    color: PIE_COLORS[['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'].indexOf(d._id) % PIE_COLORS.length],
  }));

  const driverPieData = driverStatus.map((d) => ({
    name: statusLabels[d._id] || d._id,
    value: d.count,
    color: PIE_COLORS[['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'].indexOf(d._id) % PIE_COLORS.length],
  }));

  const costData = (analytics?.vehicleDetails || []).map((v) => ({
    name: v.name || v.regNo,
    cost: v.operationalCost,
    efficiency: v.fuelEfficiency || 0,
    roi: v.roi || 0,
  })).sort((a, b) => b.cost - a.cost).slice(0, 8);

  const topCostlyData = (analytics?.topCostliestVehicles || []).map((v) => ({
    name: v.name || v.regNo,
    cost: v.operationalCost,
  })).slice(0, 5);

  const expensePieData = expenseBreakdown ? [
    { name: 'Fuel', value: expenseBreakdown.fuelCost || 0, color: '#F59E0B' },
    { name: 'Toll', value: expenseBreakdown.toll || 0, color: '#3B82F6' },
    { name: 'Misc', value: expenseBreakdown.other || 0, color: '#8B5CF6' },
  ] : [];

  const efficiencyData = (analytics?.vehicleDetails || [])
    .filter((v) => v.fuelEfficiency > 0)
    .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
    .slice(0, 6)
    .map((v) => ({
      name: v.name || v.regNo,
      efficiency: v.fuelEfficiency,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Fleet Analytics</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Comprehensive fleet performance insights and cost analysis
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={isLoading}
          className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <KpiCard icon={Truck} label="Total Vehicles" value={kpis.totalVehicles} color="#729969" />
          <KpiCard icon={Truck} label="Active" value={kpis.activeVehicles} color="#3B82F6" />
          <KpiCard icon={Truck} label="Available" value={kpis.availableVehicles} color="#10B981" />
          <KpiCard icon={Wrench} label="In Shop" value={kpis.inShopVehicles} color="#F59E0B" />
          <KpiCard icon={Route} label="Active Trips" value={kpis.activeTrips} color="#3B82F6" />
          <KpiCard icon={Route} label="Pending" value={kpis.pendingTrips} color="#8B5CF6" />
          <KpiCard icon={TrendingUp} label="Utilization" value={`${kpis.fleetUtilization}%`} color="#10B981" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[var(--card)]/50 border border-[var(--card)] w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            activeTab === 'overview'
              ? 'bg-white text-[var(--primary)] shadow-sm'
              : 'text-[var(--text)]/50 hover:text-[var(--text)]/70'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            activeTab === 'vehicles'
              ? 'bg-white text-[var(--primary)] shadow-sm'
              : 'text-[var(--text)]/50 hover:text-[var(--text)]/70'
          }`}
        >
          <Truck className="w-4 h-4" />
          Vehicles
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            activeTab === 'financial'
              ? 'bg-white text-[var(--primary)] shadow-sm'
              : 'text-[var(--text)]/50 hover:text-[var(--text)]/70'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Financial
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Pie Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Status */}
            <ChartCard title="Vehicle Status" icon={Truck}>
              {vehiclePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={vehiclePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {vehiclePieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color || PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-[var(--text)]/70">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </ChartCard>

            {/* Trip Status */}
            <ChartCard title="Trip Status" icon={Route}>
              {tripPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={tripPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {tripPieData.map((entry, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-[var(--text)]/70">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </ChartCard>

            {/* Driver Status */}
            <ChartCard title="Driver Status" icon={Users}>
              {driverPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={driverPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {driverPieData.map((entry, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-[var(--text)]/70">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </ChartCard>
          </div>

          {/* Monthly Fuel Trend */}
          <ChartCard title="Monthly Fuel Cost Trend" icon={Fuel}>
            {monthlyFuel.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFuel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalFuelCost"
                    name="Fuel Cost (₹)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalLiters"
                    name="Liters"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No fuel data for the last 6 months" />
            )}
          </ChartCard>

          {/* Expense Breakdown */}
          <ChartCard title="Expense Breakdown" icon={DollarSign}>
            {expensePieData.some((d) => d.value > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expensePieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {expensePieData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)]/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm font-medium text-[var(--text)]">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent)]">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--primary)]/5">
                    <span className="text-sm font-bold text-[var(--text)]">Total</span>
                    <span className="text-sm font-bold text-[var(--primary)]">
                      {formatCurrency(expensePieData.reduce((s, e) => s + e.value, 0))}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyChart message="No expense data available" />
            )}
          </ChartCard>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Operational Cost by Vehicle */}
          <ChartCard title="Operational Cost by Vehicle" icon={Truck}>
            {costData.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(300, costData.length * 50)}>
                <BarChart data={costData} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card)" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text)' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text)' }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost" name="Operational Cost" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No vehicle cost data available" />
            )}
          </ChartCard>

          {/* Fuel Efficiency */}
          <ChartCard title="Fuel Efficiency (km/L)" icon={Fuel}>
            {efficiencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(300, efficiencyData.length * 50)}>
                <BarChart data={efficiencyData} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card)" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text)' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text)' }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="efficiency" name="km/L" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No trip distance or fuel data to calculate efficiency" />
            )}
          </ChartCard>

          {/* Top Costliest Vehicles */}
          <ChartCard title="Top Costliest Vehicles" icon={AlertTriangle}>
            {topCostlyData.length > 0 ? (
              <div className="space-y-3">
                {topCostlyData.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background)]/50">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text)]">{v.name}</p>
                      <div className="w-full h-2 rounded-full bg-[var(--card)] mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, (v.cost / Math.max(...topCostlyData.map((x) => x.cost))) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-red-500">{formatCurrency(v.cost)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyChart message="No operational cost data" />
            )}
          </ChartCard>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Overall Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[var(--card)] shadow-sm">
              <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider mb-1">Overall Operational Cost</p>
              <p className="text-3xl font-bold text-[var(--accent)]">
                {formatCurrency(analytics?.overallOperationalCost || 0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[var(--card)] shadow-sm">
              <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider mb-1">Total Fleet Value</p>
              <p className="text-3xl font-bold text-[var(--accent)]">
                {formatCurrency((analytics?.vehicleDetails || []).reduce((s, v) => s + (v.acqCost || 0), 0))}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[var(--card)] shadow-sm">
              <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider mb-1">Avg ROI</p>
              <p className="text-3xl font-bold text-[var(--accent)]">
                {analytics?.vehicleDetails?.length > 0
                  ? `${(analytics.vehicleDetails.reduce((s, v) => s + (v.roi || 0), 0) / analytics.vehicleDetails.length).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          {/* ROI by Vehicle */}
          <ChartCard title="ROI by Vehicle" icon={TrendingUp}>
            {analytics?.vehicleDetails?.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(300, analytics.vehicleDetails.length * 45)}>
                <BarChart
                  data={analytics.vehicleDetails.map((v) => ({
                    name: v.name || v.regNo,
                    roi: v.roi || 0,
                  }))}
                  layout="vertical"
                  margin={{ left: 80, right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card)" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text)' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text)' }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="roi" name="ROI (%)" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No ROI data available" />
            )}
          </ChartCard>

          {/* Per Vehicle Details Table */}
          <ChartCard title="Vehicle-wise Cost Breakdown" icon={Activity}>
            {analytics?.vehicleDetails?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Acq. Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Op. Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Fuel Eff.</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card)]">
                    {analytics.vehicleDetails.map((v) => (
                      <tr key={v.vehicleId} className="hover:bg-[var(--background)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[var(--text)]">{v.name || v.regNo}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-[var(--text)]/70">{formatCurrency(v.acqCost)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--text)]">{formatCurrency(v.operationalCost)}</td>
                        <td className="px-4 py-3 text-right text-sm text-[var(--text)]/70">{v.fuelEfficiency} km/L</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-semibold ${v.roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {v.roi}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyChart message="No vehicle detail data" />
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-4 border border-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-medium text-[var(--text)]/50 uppercase tracking-wider">{label}</p>
      {Icon && <Icon className="w-4 h-4" style={{ color }} />}
    </div>
    <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
  </div>
);

const ChartCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl p-5 border border-[var(--card)] shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-[var(--primary)]" />}
      <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
    </div>
    {children}
  </div>
);

const EmptyChart = ({ message = 'No data available' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <BarChart3 className="w-8 h-8 text-[var(--text)]/20 mx-auto mb-2" />
      <p className="text-sm text-[var(--text)]/40">{message}</p>
    </div>
  </div>
);

export default Analytics;
