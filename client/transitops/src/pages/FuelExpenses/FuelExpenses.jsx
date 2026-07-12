import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { expenseAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  Fuel,
  Receipt,
  Plus,
  Search,
  RefreshCw,
  Droplets,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import FuelLogTable from './components/FuelLogTable';
import ExpensesTable from './components/ExpensesTable';
import AddFuelLogModal from './components/AddFuelLogModal';
import AddExpenseModal from './components/AddExpenseModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TABS = [
  { id: 'fuel', label: 'Fuel Logs', icon: Fuel },
  { id: 'expenses', label: 'Other Expenses', icon: Receipt },
];

const FuelExpenses = () => {
  const [activeTab, setActiveTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [filteredFuelLogs, setFilteredFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isFleetManager, isFinancialAnalyst } = useAuth();

  const canManage = isFinancialAnalyst || isFleetManager;
  const canView = canManage;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fuelRes, expRes] = await Promise.all([
        expenseAPI.getFuelLogs(),
        expenseAPI.getAll(),
      ]);
      setFuelLogs(fuelRes.data);
      setExpenses(expRes.data);
    } catch (err) {
      console.error('Failed to load fuel & expense data:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to load fuel & expense data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canView) fetchData();
  }, [fetchData, canView]);

  // Filter fuel logs by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFuelLogs(fuelLogs);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredFuelLogs(
      fuelLogs.filter(
        (l) =>
          l.vehicle?.name?.toLowerCase().includes(q) ||
          l.vehicle?.regNo?.toLowerCase().includes(q)
      )
    );
  }, [fuelLogs, searchQuery]);

  // Filter expenses by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExpenses(expenses);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredExpenses(
      expenses.filter(
        (e) =>
          e.vehicle?.name?.toLowerCase().includes(q) ||
          e.vehicle?.regNo?.toLowerCase().includes(q) ||
          e.trip?.tripNo?.toLowerCase().includes(q) ||
          e.trip?.source?.toLowerCase().includes(q) ||
          e.trip?.destination?.toLowerCase().includes(q)
      )
    );
  }, [expenses, searchQuery]);

  const handleAddFuel = async (data) => {
    try {
      await expenseAPI.addFuelLog(data);
      toast.success('Fuel log added successfully');
      setShowAddFuelModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add fuel log:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to add fuel log');
    }
  };

  const handleAddExpense = async (data) => {
    try {
      await expenseAPI.create(data);
      toast.success('Expense added successfully');
      setShowAddExpenseModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add expense:', err?.response?.data?.error || err.message);
      toast.error(err?.response?.data?.error || 'Failed to add expense');
    }
  };

  // Stats
  const totalFuelLiters = fuelLogs.reduce((sum, l) => sum + (l.liters || 0), 0);
  const totalFuelCost = fuelLogs.reduce((sum, l) => sum + (l.fuelCost || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.total || 0), 0);
  const avgFuelRate = totalFuelLiters > 0 ? totalFuelCost / totalFuelLiters : 0;

  if (!canView) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Access Restricted</h2>
          <p className="text-[var(--text)]/50">
            Only Financial Analysts and Fleet Managers can access this page.
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
          <h1 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Fuel & Expenses</h1>
          <p className="mt-1 text-[var(--text)]/50">
            Track fuel consumption, tolls, and miscellaneous costs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border-2 border-[var(--card)] bg-white hover:bg-[var(--background)] transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-[var(--text)]/60 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {canManage && activeTab === 'fuel' && (
            <button
              onClick={() => setShowAddFuelModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <Fuel className="w-5 h-5" />
              Add Fuel Log
            </button>
          )}
          {canManage && activeTab === 'expenses' && (
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            >
              <Receipt className="w-5 h-5" />
              Add Expense
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Fuel Volume"
          value={`${totalFuelLiters.toFixed(1)} L`}
          color="#F59E0B"
          icon={Droplets}
        />
        <StatCard
          label="Total Fuel Cost"
          value={`₹${totalFuelCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="#F59E0B"
          icon={Fuel}
        />
        <StatCard
          label="Avg Fuel Rate"
          value={`₹${avgFuelRate.toFixed(2)}/L`}
          color="#3B82F6"
          icon={TrendingUp}
        />
        <StatCard
          label="Other Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="#EF4444"
          icon={IndianRupee}
        />
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

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text)]/40" />
        <input
          type="text"
          placeholder={activeTab === 'fuel' ? 'Search by vehicle...' : 'Search vehicle, trip...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {activeTab === 'fuel' && <FuelLogTable logs={filteredFuelLogs} canManage={canManage} />}
          {activeTab === 'expenses' && <ExpensesTable expenses={filteredExpenses} canManage={canManage} />}
        </>
      )}

      {/* Modals */}
      {showAddFuelModal && (
        <AddFuelLogModal
          onClose={() => setShowAddFuelModal(false)}
          onSave={handleAddFuel}
        />
      )}
      {showAddExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowAddExpenseModal(false)}
          onSave={handleAddExpense}
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

export default FuelExpenses;
