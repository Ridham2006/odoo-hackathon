const status = [
  {
    name: "Available",
    value: 80,
    color: "#22C55E",
  },
  {
    name: "On Trip",
    value: 35,
    color: "#60A5FA",
  },
  {
    name: "In Shop",
    value: 20,
    color: "#D97706",
  },
  {
    name: "Retired",
    value: 10,
    color: "#FB7185",
  },
];

const VehicleStatus = () => {
  return (
    <div className="rounded-xl bg-[#E6E7EB] p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Vehicle Status
      </h2>

      <div className="space-y-5">

        {status.map((item) => (

          <div key={item.name}>

            <div className="mb-2 flex justify-between">

              <span>{item.name}</span>

              <span>{item.value}%</span>

            </div>

            <div className="h-3 rounded-full bg-gray-300">

              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.value}%`,
                  background: item.color,
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