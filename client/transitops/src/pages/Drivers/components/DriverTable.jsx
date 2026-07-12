import { Pencil, Trash2, Phone, Calendar, Award } from 'lucide-react';

const statusColorMap = {
  AVAILABLE: 'bg-[#729969]',
  ON_TRIP: 'bg-blue-500',
  OFF_DUTY: 'bg-gray-500',
  SUSPENDED: 'bg-red-500',
};

const safetyColorMap = {
  Good: 'bg-green-500',
  Average: 'bg-yellow-500',
  Poor: 'bg-red-500',
};

const DriverTable = ({ drivers, onEdit, onDelete, canManage }) => {
  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
          <Award className="w-7 h-7 text-[var(--primary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Drivers Found</h3>
        <p className="text-sm text-[var(--text)]/50">
          {drivers.length === 0
            ? "Add your first driver to get started."
            : "Try adjusting your search or filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--card)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card)] bg-[var(--background)]/50">
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Driver</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">License No</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Category</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">License Expiry</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Contact</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Trips</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Safety</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Status</th>
              {canManage && <th className="px-5 py-4 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {drivers.map((driver) => {
              const isExpired = new Date(driver.expiry) < new Date();
              const initials = driver.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <tr
                  key={driver._id}
                  className="hover:bg-[var(--background)]/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm ${
                        driver.status === 'SUSPENDED' ? 'bg-red-400' : 'bg-[var(--primary)]'
                      }`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text)]">{driver.name}</p>
                        <p className="text-xs text-[var(--text)]/40">{driver.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-sm font-mono text-[var(--text)]/70 bg-[var(--background)] px-2 py-1 rounded-lg">
                      {driver.licenseNo}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[var(--text)]">{driver.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--text)]/40" />
                      <span className={`text-sm ${isExpired ? 'text-red-500 font-semibold' : 'text-[var(--text)]/70'}`}>
                        {new Date(driver.expiry).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {isExpired && (
                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Expired</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm text-[var(--text)]/70">{driver.contact}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[var(--text)]">{driver.tripCompleted}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
                      safetyColorMap[driver.safetyStatus] || 'bg-green-500'
                    }`}>
                      <Award className="w-3 h-3" />
                      {driver.safetyStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      statusColorMap[driver.status] || 'bg-gray-400'
                    }`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(driver)}
                          className="p-2 rounded-xl text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-200"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(driver._id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[var(--card)] bg-[var(--background)]/30 text-sm text-[var(--text)]/40">
        Showing {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default DriverTable;
