const Navbar = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Search */}

      <div className="w-[320px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition-all duration-200 focus:border-[#729969] focus:ring-2 focus:ring-[#729969]/20"
        />
      </div>

      {/* Right Side */}

      <div className="flex items-center gap-5">

        <p className="font-medium text-gray-700">
          Raven K.
        </p>

        <span className="rounded-lg bg-[#729969] px-4 py-2 text-sm font-medium text-white">
          Dispatcher
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A1C0C2] font-semibold text-[#223125]">
          RK
        </div>

      </div>
    </header>
  );
};

export default Navbar;