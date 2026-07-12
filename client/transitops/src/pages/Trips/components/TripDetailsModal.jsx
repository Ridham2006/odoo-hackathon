import { X, MapPin, Package, Gauge, Calendar, User, Truck, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
    icon: Package,
  },
  DISPATCHED: {
    label: 'Dispatched',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    icon: Send,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-[#729969]',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    icon: XCircle,
  },
};

const TripDetailsModal = ({ trip, onClose, onDispatch, onComplete, onCancel, isProcessing }) => {
  if (!trip) return null;

  const StatusIcon = statusConfig[trip.status]?.icon || Package;
  const vehicleName = trip.vehicle?.name || trip.vehicle?.regNo || 'Not assigned';
  const driverName = trip.driver?.name || 'Not assigned';

  const isDraft = trip.status === 'DRAFT';
  const isDispatched = trip.status === 'DISPATCHED';
  const isCompleted = trip.status === 'COMPLETED';
  const isCancelled = trip.status === 'CANCELLED';
  const canAct = !isCompleted && !isCancelled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card)]">
          <div className="flex items-center gap-3">
            <code className="text-lg font-mono font-bold text-[var(--accent)] bg-[var(--background)] px-3 py-1.5 rounded-xl">
              {trip.tripNo}
            </code>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[trip.status]?.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig[trip.status]?.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--card)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text)]/50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Route Map */}
          <div className="bg-[var(--background)]/30 rounded-2xl p-5 border border-[var(--card)]">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                <div className="w-0.5 h-10 bg-gradient-to-b from-[var(--primary)] to-blue-500" />
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Source</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-[var(--primary)]" />
                    <p className="font-semibold text-[var(--text)]">{trip.source}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Destination</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-[var(--text)]">{trip.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-[var(--primary)]" />
                <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Vehicle</p>
              </div>
              <p className="font-semibold text-[var(--text)]">{vehicleName}</p>
              {trip.vehicle?.regNo && (
                <p className="text-xs text-[var(--text)]/50 mt-0.5">{trip.vehicle.regNo} · {trip.vehicle.type}</p>
              )}
            </div>
            <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[var(--primary)]" />
                <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Driver</p>
              </div>
              <p className="font-semibold text-[var(--text)]">{driverName}</p>
              {trip.driver?.licenseNo && (
                <p className="text-xs text-[var(--text)]/50 mt-0.5">{trip.driver.licenseNo}</p>
              )}
            </div>
          </div>

          {/* Load & Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Cargo Weight</p>
              </div>
              <p className="text-2xl font-bold text-[var(--accent)]">{trip.cargoWeight} <span className="text-sm font-normal text-[var(--text)]/50">kg</span></p>
            </div>
            <div className="bg-[var(--background)]/30 rounded-2xl p-4 border border-[var(--card)]">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-semibold text-[var(--text)]/40 uppercase tracking-wider">Planned Distance</p>
              </div>
              <p className="text-2xl font-bold text-[var(--accent)]">{trip.plannedDistance} <span className="text-sm font-normal text-[var(--text)]/50">km</span></p>
            </div>
          </div>

          {/* Created At */}
          {trip.createdAt && (
            <div className="flex items-center gap-2 text-sm text-[var(--text)]/50">
              <Calendar className="w-4 h-4" />
              Created on {new Date(trip.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}

          {/* Action Buttons */}
          {canAct && (
            <div className="flex gap-3 pt-2 border-t border-[var(--card)]">
              {isDraft && (
                <button
                  onClick={onDispatch}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Dispatch Trip
                </button>
              )}
              {isDispatched && (
                <button
                  onClick={onComplete}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 text-white font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Complete Trip
                </button>
              )}
              {(isDraft || isDispatched) && (
                <button
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="py-3 px-6 rounded-2xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
