const StatCard = ({ title, value, color }) => {
  return (
    <div className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-gray-200 relative overflow-hidden">

      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: color }}
      />

      <p className="text-xs uppercase tracking-wider text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-[#223125]">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;