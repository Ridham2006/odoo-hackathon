const FleetFilters = () => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

      {/* Left Side */}

      <div className="flex flex-wrap gap-4">

        <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-[#729969]">
          <option>All Types</option>
          <option>Van</option>
          <option>Truck</option>
          <option>Mini</option>
        </select>

        <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-[#729969]">
          <option>All Status</option>
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
          <option>Retired</option>
        </select>

        <input
          type="text"
          placeholder="Search Registration..."
          className="w-72 rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-[#729969]"
        />

      </div>

      {/* Right Side */}

      <button className="rounded-lg bg-[#729969] px-5 py-2 font-medium text-white transition hover:opacity-90">
        + Add Vehicle
      </button>

    </div>
  );
};

export default FleetFilters;