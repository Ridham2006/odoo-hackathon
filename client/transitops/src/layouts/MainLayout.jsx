import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Navbar from "../components/layout/Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
