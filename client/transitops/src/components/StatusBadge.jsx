const statusStyles = {
  "On Trip": "bg-blue-500 text-white",
  Completed: "bg-green-500 text-white",
  Dispatched: "bg-sky-500 text-white",
  Draft: "bg-gray-400 text-white",
  Available: "bg-green-500 text-white",
  "In Shop": "bg-orange-500 text-white",
  Retired: "bg-red-400 text-white",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-gray-300 text-black"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;