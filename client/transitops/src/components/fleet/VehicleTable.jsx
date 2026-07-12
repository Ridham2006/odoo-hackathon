import { vehicles } from "../../data/fleetData";
import StatusBadge from "../StatusBadge";
import { Pencil, Trash2 } from "lucide-react";

const VehicleTable = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-[#E6E7EB] shadow-sm">

      <table className="w-full">

        <thead className="bg-[#D9DCE1]">

          <tr className="text-left">

            <th className="px-5 py-4">Registration</th>
            <th className="px-5 py-4">Vehicle</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Capacity</th>
            <th className="px-5 py-4">Odometer</th>
            <th className="px-5 py-4">Cost</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {vehicles.map((vehicle) => (

            <tr
              key={vehicle.regNo}
              className="border-t border-gray-300 hover:bg-[#F2F2F2]"
            >

              <td className="px-5 py-4">{vehicle.regNo}</td>

              <td className="px-5 py-4 font-medium">
                {vehicle.name}
              </td>

              <td className="px-5 py-4">
                {vehicle.type}
              </td>

              <td className="px-5 py-4">
                {vehicle.capacity}
              </td>

              <td className="px-5 py-4">
                {vehicle.odometer}
              </td>

              <td className="px-5 py-4">
                ₹ {vehicle.cost}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={vehicle.status} />
              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-4">

                  <button className="text-[#729969] hover:scale-110 transition">
                    <Pencil size={18} />
                  </button>

                  <button className="text-red-500 hover:scale-110 transition">
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default VehicleTable;