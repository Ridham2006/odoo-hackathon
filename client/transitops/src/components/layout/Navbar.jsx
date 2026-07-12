const Navbar = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      <input
        type="text"
        placeholder="Search..."
        className="w-80 rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-[#729969]"
      />

      <div className="flex items-center gap-5">

        <span className="font-medium">
          Raven K.
        </span>

        <span className="rounded-lg bg-[#729969] px-4 py-2 text-sm text-white">
          Dispatcher
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A1C0C2] font-semibold">
          RK
        </div>

      </div>

    </header>
  );
};

export default Navbar;