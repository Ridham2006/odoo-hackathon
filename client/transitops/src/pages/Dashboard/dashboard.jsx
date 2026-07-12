import MainLayout from "../../layouts/MainLayout";

import DashboardFilters from "../../components/dashboard/DashboardFilters";
import StatCard from "../../components/dashboard/StatCard";
import RecentTrips from "../../components/dashboard/RecentTrips";
import VehicleStatus from "../../components/dashboard/VehicleStatus";

const Dashboard = () => {
  return (
    <MainLayout>
      <DashboardFilters />

      {/* KPI Cards */}
      <div className="grid grid-cols-7 gap-5">
        <StatCard title="Active Vehicles" value="53" color="#3B82F6" />
        <StatCard title="Available Vehicles" value="42" color="#22C55E" />
        <StatCard title="In Maintenance" value="05" color="#F59E0B" />
        <StatCard title="Active Trips" value="18" color="#3B82F6" />
        <StatCard title="Pending Trips" value="09" color="#3B82F6" />
        <StatCard title="Drivers On Duty" value="26" color="#3B82F6" />
        <StatCard title="Fleet Utilization" value="81%" color="#22C55E" />
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1
md:grid-cols-2
xl:grid-cols-4
2xl:grid-cols-7 gap-6">
        <div className="col-span-2">
          <RecentTrips />
        </div>

        <div className="w-full">
    <VehicleStatus />
  </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;