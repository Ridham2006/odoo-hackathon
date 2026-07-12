import StatusBadge from "../StatusBadge";

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#E6E7EB]">

      <table className="w-full">

        <thead className="border-b border-gray-300">

          <tr>

            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-5 py-4 text-left text-sm font-semibold text-[#223125]"
              >
                {column.header}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row, index) => (

            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-[#dfe2e6]"
            >

              {columns.map((column) => (

                <td
                  key={column.accessor}
                  className="px-5 py-4 text-sm"
                >

                  {column.accessor === "status" ? (
                    <StatusBadge status={row.status} />
                  ) : (
                    row[column.accessor]
                  )}

                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Table;