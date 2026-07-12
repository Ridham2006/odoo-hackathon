import { Pencil, Trash2, Truck, Gauge, Weight } from 'lucide-react';

const statusColorMap = {
  AVAILABLE: 'bg-[#729969]',
  ON_TRIP: 'bg-blue-500',
  IN_SHOP: 'bg-yellow-500',
  RETIRED: 'bg-gray-500',
};

const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-7 h-7 text-[var(--primary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Vehicles Found</h3>
        <p className="text-sm text-[var(--text)]/50">
          {vehicles.length === 0
            ? 'Add your first vehicle to get started.'
            : 'Try adjusting your search or filters.'}
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
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Registration</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Type</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Capacity</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Odometer</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Cost</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {vehicles.map((vehicle) => {
              const formatCurrency = (amount) =>
                new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

              return (
                <tr
                  key={vehicle._id}
                  className="hover:bg-[var(--background)]/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4">
                    <code className="text-sm font-mono text-[var(--text)]/70 bg-[var(--background)] px-2 py-1 rounded-lg font-semibold">
                      {vehicle.regNo}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                        {vehicle.name?.slice(0, 2).toUpperCase() || 'V'}
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{vehicle.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--text)]/70">{vehicle.type}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Weight className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm font-medium text-[var(--text)]">{vehicle.capacity} kg</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Gauge className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm text-[var(--text)]/70">{vehicle.odometer?.toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold text-[var(--text)]">{formatCurrency(vehicle.acqCost)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      statusColorMap[vehicle.status] || 'bg-gray-400'
                    }`}>
                      {vehicle.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="p-2 rounded-xl text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-200"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(vehicle._id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[var(--card)] bg-[var(--background)]/30 text-sm text-[var(--text)]/40">
        Showing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default VehicleTable;
