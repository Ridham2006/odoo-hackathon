import { recentTrips } from "../../data/dashboardData";
import StatusBadge from "../StatusBadge";

const RecentTrips = () => {
  return (
    <div className="rounded-xl bg-[#E6E7EB] p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        Recent Trips
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left text-gray-500 border-b">

            <th className="pb-3">Trip</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Status</th>
            <th>ETA</th>

          </tr>

        </thead>

        <tbody>

          {recentTrips.map((trip) => (

            <tr
              key={trip.trip}
              className="border-b border-gray-300"
            >

              <td className="py-4">{trip.trip}</td>

              <td>{trip.vehicle}</td>

              <td>{trip.driver}</td>

              <td>

                <StatusBadge
                  status={trip.status}
                />

              </td>

              <td>{trip.eta}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentTrips;