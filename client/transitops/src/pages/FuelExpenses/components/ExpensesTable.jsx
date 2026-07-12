import { IndianRupee, MapPin, Truck, Wrench, Receipt } from 'lucide-react';

const ExpensesTable = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Expenses Found</h3>
        <p className="text-sm text-[var(--text)]/50">
          Add toll, maintenance, or miscellaneous expenses to start tracking.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  const grandTotal = expenses.reduce((sum, e) => sum + (e.total || 0), 0);
  const totalToll = expenses.reduce((sum, e) => sum + (e.toll || 0), 0);
  const totalOther = expenses.reduce((sum, e) => sum + (e.other || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm overflow-hidden">
      {/* Summary bar */}
      <div className="flex items-center gap-6 px-5 py-3 bg-red-50/50 border-b border-[var(--card)]">
        <div className="flex items-center gap-2 text-sm">
          <Receipt className="w-4 h-4 text-red-500" />
          <span className="text-[var(--text)]/60">Total:</span>
          <span className="font-semibold text-[var(--text)]">{formatCurrency(grandTotal)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--text)]/40">Toll:</span>
          <span className="font-semibold text-[var(--text)]">{formatCurrency(totalToll)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--text)]/40">Other:</span>
          <span className="font-semibold text-[var(--text)]">{formatCurrency(totalOther)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Trip</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Toll</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Other</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Maintenance</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {expenses.map((exp) => {
              const vehicleName = exp.vehicle?.name || exp.vehicle?.regNo || '—';
              const tripInfo = exp.trip
                ? `${exp.trip.tripNo || ''} ${exp.trip.source || ''}→${exp.trip.destination || ''}`
                : '—';
              const maintenanceCost = Math.max(0, exp.total - (exp.toll || 0) - (exp.other || 0));

              return (
                <tr
                  key={exp._id}
                  className="hover:bg-[var(--background)]/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-xs font-bold text-red-600">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {exp.trip ? (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[var(--text)]/40 shrink-0" />
                        <span className="text-sm text-[var(--text)]/70 truncate max-w-[180px]" title={tripInfo}>
                          {tripInfo}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text)]/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {exp.toll > 0 ? (
                      <span className="text-sm font-medium text-[var(--text)]">{formatCurrency(exp.toll)}</span>
                    ) : (
                      <span className="text-sm text-[var(--text)]/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {exp.other > 0 ? (
                      <span className="text-sm font-medium text-[var(--text)]">{formatCurrency(exp.other)}</span>
                    ) : (
                      <span className="text-sm text-[var(--text)]/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {maintenanceCost > 0 ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Wrench className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium text-[var(--text)]">{formatCurrency(maintenanceCost)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text)]/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-[var(--accent)]">{formatCurrency(exp.total)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[var(--card)] bg-[var(--background)]/30 text-sm text-[var(--text)]/40">
        Showing {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ExpensesTable;
