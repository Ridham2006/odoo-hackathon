import { useState } from 'react';
import { Award, MapPin, Package, Gauge } from 'lucide-react';

const statusColorMap = {
  DRAFT: 'bg-gray-500',
  DISPATCHED: 'bg-blue-500',
  COMPLETED: 'bg-[#729969]',
  CANCELLED: 'bg-red-500',
};

const tripStatusLabels = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const TripTable = ({ trips, onViewDetails, canManage }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-[var(--primary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Trips Found</h3>
        <p className="text-sm text-[var(--text)]/50">
          {trips.length === 0
            ? 'Create your first trip to get started.'
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
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Trip No</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Route</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Vehicle</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Driver</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Cargo</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Distance</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-[var(--text)]/50 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card)]">
            {trips.map((trip) => {
              const vehicleName = trip.vehicle?.name || trip.vehicle?.regNo || '—';
              const driverName = trip.driver?.name || '—';
              const canDispatch = trip.status === 'DRAFT' && canManage;
              const canComplete = trip.status === 'DISPATCHED' && canManage;
              const canCancel = (trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && canManage;

              return (
                <tr
                  key={trip._id}
                  className="hover:bg-[var(--background)]/50 transition-colors duration-150 group"
                >
                  <td className="px-5 py-4">
                    <code className="text-sm font-mono text-[var(--text)]/70 bg-[var(--background)] px-2 py-1 rounded-lg font-semibold">
                      {trip.tripNo}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <MapPin className="w-4 h-4 text-[var(--text)]/40 shrink-0" />
                      <span className="text-sm text-[var(--text)]/80 truncate" title={`${trip.source} → ${trip.destination}`}>
                        {trip.source} → {trip.destination}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                        {vehicleName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{vehicleName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--text)]/70">{driverName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm text-[var(--text)]/70">{trip.cargoWeight} kg</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-[var(--text)]/40" />
                      <span className="text-sm text-[var(--text)]/70">{trip.plannedDistance} km</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      statusColorMap[trip.status] || 'bg-gray-400'
                    }`}>
                      {tripStatusLabels[trip.status] || trip.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewDetails(trip)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-all duration-200"
                        title="View Details"
                      >
                        Details
                      </button>
                      {canDispatch && (
                        <button
                          onClick={() => onViewDetails(trip)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                          title="Dispatch"
                        >
                          Dispatch
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => onViewDetails(trip)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-200"
                          title="Cancel"
                        >
                          Cancel
                        </button>
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
        Showing {trips.length} trip{trips.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TripTable;
