const data = [
  {
    label: "Available",
    value: 80,
    color: "#22C55E",
  },
  {
    label: "On Trip",
    value: 35,
    color: "#3B82F6",
  },
  {
    label: "In Shop",
    value: 20,
    color: "#F59E0B",
  },
  {
    label: "Retired",
    value: 10,
    color: "#FB7185",
  },
];

const VehicleStatus = () => {
  return (
    <div className="w-full min-h-87.5 rounded-2xl bg-[#E6E7EB] p-10 shadow-sm border border-gray-200">
      <h2 className="mb-6 text-xl font-semibold text-[#223125]">
        Vehicle Status
      </h2>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            {/* Label & Percentage */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[#223125]">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-gray-600">
                {item.value}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-300">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleStatus;