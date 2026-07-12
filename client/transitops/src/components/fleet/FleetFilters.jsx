import { Search, Filter } from 'lucide-react';

const FleetFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text)]/40" />
        <input
          type="text"
          placeholder="Search name, registration..."
          value={filters.search}
          onChange={(e) => onFilterChange((f) => ({ ...f, search: e.target.value }))}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-200"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
        <select
          value={filters.type}
          onChange={(e) => onFilterChange((f) => ({ ...f, type: e.target.value }))}
          className="pl-10 pr-8 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
          <option value="Bus">Bus</option>
        </select>
      </div>
      <div className="relative">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/40" />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange((f) => ({ ...f, status: e.target.value }))}
          className="pl-10 pr-8 py-2.5 rounded-2xl border-2 border-[var(--card)] bg-white outline-none focus:border-[var(--primary)] transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>
    </div>
  );
};

export default FleetFilters;
