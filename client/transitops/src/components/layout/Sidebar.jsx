import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Fleet",
    icon: Truck,
    path: "/fleet",
  },
  {
    name: "Drivers",
    icon: Users,
    path: "/drivers",
  },
  {
    name: "Trips",
    icon: Route,
    path: "/trips",
  },
  {
    name: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    name: "Fuel & Expenses",
    icon: Fuel,
    path: "/fuel",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#223125] text-white flex flex-col">

      {/* Logo */}

      <div className="px-8 pt-8 pb-10">

        <h1 className="text-3xl font-bold tracking-wide">
          TransitOps
        </h1>

      </div>

      {/* Menu */}

      <nav className="flex flex-col gap-2 px-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                ${
                  isActive
                    ? "bg-[#729969] text-white shadow-md"
                    : "hover:bg-[#2d4030]"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;