import { NavLink } from "react-router-dom";

const menuItems = [
  "Dashboard",
  "Fleet",
  "Drivers",
  "Trips",
  "Maintenance",
  "Fuel & Expenses",
  "Analytics",
  "Settings",
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#223125] text-white flex flex-col">

      <div className="px-8 py-8">
        <h1 className="text-3xl font-bold tracking-wide">
          TransitOps
        </h1>
      </div>

      <nav className="flex flex-col gap-2 px-4">

        {menuItems.map((item) => (
          <NavLink
            key={item}
            to="/"
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 transition-all duration-200
              ${
                isActive
                  ? "bg-[#729969] text-white"
                  : "hover:bg-[#2f4334]"
              }`
            }
          >
            {item}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
};

export default Sidebar;