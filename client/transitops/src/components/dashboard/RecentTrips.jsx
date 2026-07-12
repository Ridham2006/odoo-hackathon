import Table from "../ui/Table";
import { recentTrips } from "../../data/dashboardData";

const columns = [
  {
    header: "Trip",
    accessor: "trip",
  },
  {
    header: "Vehicle",
    accessor: "vehicle",
  },
  {
    header: "Driver",
    accessor: "driver",
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "ETA",
    accessor: "eta",
  },
];

const RecentTrips = () => {
  return (
    <div className="w-full rounded-2xl bg-[#E6E7EB] shadow-sm p-3">
      <h2 className="text-xl font-semibold text-[#223125]">
        Recent Trips
      </h2>
      <div className="overflow-x-auto">
        <Table columns={columns} data={recentTrips} />
      </div>
    </div>
  );
};

export default RecentTrips;