const colors = {
  "Available": "bg-[#729969]",
  "On Trip": "bg-blue-500",
  "In Shop": "bg-orange-500",
  "Retired": "bg-gray-500",

  "Completed": "bg-[#729969]",
  "Draft": "bg-gray-500",
  "Dispatched": "bg-blue-500",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-semibold text-white ${
        colors[status]
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;