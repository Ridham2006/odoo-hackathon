import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Award, Clock, TrendingUp, UserCheck } from 'lucide-react';

const SafetyProfile = ({ drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [sortBy, setSortBy] = useState('safetyStatus');

  // Aggregate safety stats
  const safetyStats = {
    good: drivers.filter((d) => d.safetyStatus === 'Good').length,
    average: drivers.filter((d) => d.safetyStatus === 'Average').length,
    poor: drivers.filter((d) => d.safetyStatus === 'Poor').length,
    expiredLicenses: drivers.filter((d) => new Date(d.expiry) < new Date()).length,
    totalTrips: drivers.reduce((sum, d) => sum + (d.tripCompleted || 0), 0),
    activeSafety: drivers.filter((d) => d.safetyStatus === 'Good' && d.status !== 'SUSPENDED').length,
  };

  // Sort drivers
  const sortedDrivers = [...drivers].sort((a, b) => {
    if (sortBy === 'safetyStatus') {
      const order = { Good: 0, Average: 1, Poor: 2 };
      return (order[a.safetyStatus] ?? 0) - (order[b.safetyStatus] ?? 0);
    }
    if (sortBy === 'trips') return (b.tripCompleted || 0) - (a.tripCompleted || 0);
    if (sortBy === 'expiry') return new Date(a.expiry) - new Date(b.expiry);
    return 0;
  });

  const selectedDetails = selectedDriver
    ? drivers.find((d) => d._id === selectedDriver)
    : null;

  return (
    <div className="space-y-6">
      {/* Safety Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SafetyStatCard 
          icon={ShieldCheck} 
          label="Safe Drivers" 
          value={safetyStats.good} 
          total={drivers.length}
          color="green" 
        />
        <SafetyStatCard 
          icon={AlertTriangle} 
          label="Needs Attention" 
          value={safetyStats.poor + safetyStats.average} 
          total={drivers.length}
          color="red" 
        />
        <SafetyStatCard 
          icon={Clock} 
          label="Expired Licenses" 
          value={safetyStats.expiredLicenses} 
          total={drivers.length}
          color="orange" 
        />
        <SafetyStatCard 
          icon={TrendingUp} 
          label="Total Trips" 
          value={safetyStats.totalTrips}
          color="blue" 
        />
      </div>

      {/* Safety Compliance Table */}
      <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--card)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--text)]">Driver Safety Compliance</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--text)]/50 font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-2 border-[var(--card)] rounded-xl px-3 py-1.5 outline-none focus:border-[var(--primary)] bg-white"
            >
              <option value="safetyStatus">Safety Status</option>
              <option value="trips">Most Trips</option>
              <option value="expiry">License Expiry</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">License</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Trips</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Safety Status</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">License Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card)]">
              {sortedDrivers.map((driver) => {
                const isExpired = new Date(driver.expiry) < new Date();
                const isSelected = selectedDriver === driver._id;

                return (
                  <tr
                    key={driver._id}
                    onClick={() => setSelectedDriver(isSelected ? null : driver._id)}
                    className={`cursor-pointer transition-colors duration-150 hover:bg-[var(--background)]/50 ${
                      isSelected ? 'bg-[var(--primary)]/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm ${
                          driver.safetyStatus === 'Poor' ? 'bg-red-400' : 
                          driver.safetyStatus === 'Average' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {driver.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text)]">{driver.name}</p>
                          <p className="text-xs text-[var(--text)]/40">{driver.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-[var(--background)] px-2 py-1 rounded-lg text-[var(--text)]/70">
                        {driver.licenseNo}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold">{driver.tripCompleted}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <SafetyBadge status={driver.safetyStatus} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DriverStatusBadge status={driver.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm ${isExpired ? 'text-red-500 font-semibold' : 'text-[var(--text)]/70'}`}>
                        {new Date(driver.expiry).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Driver Details */}
      {selectedDetails && (
        <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm p-6 animate-fade-in">
          <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[var(--primary)]" />
            Driver Details — {selectedDetails.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem label="License No" value={selectedDetails.licenseNo} />
            <DetailItem label="Category" value={selectedDetails.category} />
            <DetailItem label="Contact" value={selectedDetails.contact} />
            <DetailItem 
              label="License Expiry" 
              value={new Date(selectedDetails.expiry).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              highlight={new Date(selectedDetails.expiry) < new Date()}
            />
            <DetailItem label="Status" value={selectedDetails.status.replace('_', ' ')} />
            <DetailItem label="Safety Status" value={selectedDetails.safetyStatus} />
            <DetailItem label="Trips Completed" value={String(selectedDetails.tripCompleted)} />
            <DetailItem label="Driver ID" value={selectedDetails._id.slice(-8).toUpperCase()} />
          </div>
        </div>
      )}
    </div>
  );
};

const SafetyStatCard = ({ icon: Icon, label, value, total, color }) => {
  const colors = {
    green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600' },
    red: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-600' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
    blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  };
  const c = colors[color] || colors.blue;
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[var(--card)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${c.light} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        {total && (
          <span className={`text-xs font-semibold ${c.text} ${c.light} px-2 py-0.5 rounded-full`}>
            {percentage}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
      <p className="text-xs text-[var(--text)]/50 mt-0.5">{label}</p>
    </div>
  );
};

const SafetyBadge = ({ status }) => {
  const config = {
    Good: { bg: 'bg-green-100', text: 'text-green-700', icon: '✓' },
    Average: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '!' },
    Poor: { bg: 'bg-red-100', text: 'text-red-700', icon: '✗' },
  };
  const c = config[status] || config.Good;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <Award className="w-3 h-3" />
      {status}
    </span>
  );
};

const DriverStatusBadge = ({ status }) => {
  const config = {
    AVAILABLE: 'bg-blue-100 text-blue-700',
    ON_TRIP: 'bg-orange-100 text-orange-700',
    OFF_DUTY: 'bg-gray-100 text-gray-700',
    SUSPENDED: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${config[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const DetailItem = ({ label, value, highlight }) => (
  <div className={`p-3 rounded-xl border ${highlight ? 'border-red-200 bg-red-50' : 'border-[var(--card)] bg-[var(--background)]/50'}`}>
    <p className="text-xs text-[var(--text)]/40 font-medium mb-0.5">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-red-600' : 'text-[var(--text)]'}`}>{value}</p>
  </div>
);

export default SafetyProfile;
