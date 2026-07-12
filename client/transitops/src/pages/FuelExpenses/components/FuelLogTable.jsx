import { Fuel, Calendar, Droplets, IndianRupee, Truck } from 'lucide-react';

const FuelLogTable = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Fuel className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Fuel Logs Found</h3>
        <p className="text-sm text-[var(--text)]/50">
          {logs.length === 0
            ? 'Record your first fuel refill to start tracking.'
            : 'Try adjusting your search or filters.'}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const totalLiters = logs.reduce((sum, l) => sum + (l.liters || 0), 0);
  const totalCost = logs.reduce((sum, l) => sum + (l.fuelCost || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm overflow-hidden">
      {/* Summary bar */}
      <div className="flex items-center gap-6 px-5 py-3 bg-amber-50/50 border-b border-[var(--card)]">
        <div className="flex items-center gap-2 text-sm">
          <Droplets className="w-4 h-4 text-amber-500" />
          <span className="text-[var(--text)]/60">Total:</span>
          <span className="font-semibold text-[var(--text)]">{totalLiters.toFixed(1)} L</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee className="w-4 h-4 text-amber-500" />
          <span className="text-[var(--text)]/60">Cost:</span>
          <span className="font-semibold text-[var(--text)]">{formatCurrency(totalCost)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm ml-auto">
          <span className="text-[var(--text)]/40">Avg Rate:</span>
          <span className="font-semibold text-[var(--text)]">
            {totalLiters > 0 ? `₹${(totalCost / totalLiters).toFixed(2)}/L` : '—'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Date</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Liters</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Fuel Cost</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Rate/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {logs.map((log) => {
              const rate = log.liters > 0 ? (log.fuelCost / log.liters) : 0;
              return (
                <tr
                  key={log._id}
                  className="hover:bg-[var(--background)]/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm text-[var(--text)]/80">
                        {new Date(log.date).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">
                        {log.vehicle?.name || log.vehicle?.regNo || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-[var(--text)]">{log.liters?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold text-[var(--text)]">{formatCurrency(log.fuelCost)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-[var(--text)]/60">₹{rate.toFixed(2)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[var(--card)] bg-[var(--background)]/30 text-sm text-[var(--text)]/40">
        Showing {logs.length} fuel log{logs.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default FuelLogTable;
