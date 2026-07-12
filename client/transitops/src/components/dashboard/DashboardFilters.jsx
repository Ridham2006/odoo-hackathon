const DashboardFilters = () => {
  return (
    <div className="mb-8 flex gap-4">

      <select className="w-52 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#729969]">
        <option>Vehicle Type : All</option>
      </select>

      <select className="w-52 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#729969]">
        <option>Status : All</option>
      </select>

      <select className="w-52 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#729969]">
        <option>Region : All</option>
      </select>

    </div>
  );
};

export default DashboardFilters;