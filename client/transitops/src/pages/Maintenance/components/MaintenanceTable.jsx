import { Wrench, Calendar, Truck, IndianRupee, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  OPEN: { label: 'Open', color: 'bg-yellow-100 text-yellow-700', icon: XCircle },
  CLOSED: { label: 'Closed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const MaintenanceTable = ({ logs, onClose }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-7 h-7 text-yellow-500" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Maintenance Records</h3>
        <p className="text-sm text-[var(--text)]/50">
          Create a new service record to start tracking vehicle maintenance.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Date</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Service Type</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Cost</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {logs.map((log) => {
              const StatusIcon = statusConfig[log.status]?.icon || Wrench;
              const vehicleName = log.vehicle?.name || log.vehicle?.regNo || '—';

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
                      <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center text-xs font-bold text-yellow-600">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--text)]/70">{log.serviceType}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <IndianRupee className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-[var(--text)]">{formatCurrency(log.cost)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      statusConfig[log.status]?.color || 'bg-gray-100 text-gray-700'
                    }`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig[log.status]?.label || log.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center">
                      {log.status === 'OPEN' && (
                        <button
                          onClick={() => onClose(log._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 transition-all duration-200 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Close
                        </button>
                      )}
                      {log.status === 'CLOSED' && (
                        <span className="text-xs text-[var(--text)]/40">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[var(--card)] bg-[var(--background)]/30 text-sm text-[var(--text)]/40">
        Showing {logs.length} record{logs.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MaintenanceTable;
