import MainLayout from "../../layouts/MainLayout";
import FleetFilters from "../../components/fleet/FleetFilters";
import VehicleTable from "../../components/fleet/VehicleTable";

const Fleet = () => {
  return (
    <MainLayout>

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-[#223125]">
          Vehicle Registry
        </h1>

        <p className="mt-1 text-gray-500">
          Manage all fleet vehicles from one place.
        </p>

      </div>

      <FleetFilters />
      <VehicleTable />

    </MainLayout>
  );
};

export default Fleet;