/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CustomerGroupInfoTable = ({ customerGroups }) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredCustomerGroups = customerGroups.filter((customerGroup) =>
    customerGroup.customerGroupName.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  // Fix handleEdit function
  const handleEdit = (customerGroupId) => {
    const customerGroup = customerGroups.find(
      (cg) => cg.customerGroupId === customerGroupId
    );
    navigate(`/edit-customer-group/${customerGroupId}`, {
      state: { customerGroup },
    });
  };

  const handleViewCustomerGroup = (customerGroup) => {
    navigate(`/view-customer-group/${customerGroup.customerGroupId}`, {
      state: { customerGroup },
    });
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Customer Groups Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Customer Groups</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Customer Group..."
            value={search}
            onChange={(cg) => setSearch(cg.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {/* Display Message if No Groups Found */}
      {filteredCustomerGroups.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No customer groups found matching your search.
        </div>
      )}

      {/* Customer Groups Table */}
      <div className="p-2 overflow-x-auto">
        <table className="w-full border border-collapse border-gray-400">
          <thead>
            <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
              {[
                "Customer Group Name",
                "Sales Rep ID",
                "Sales Rep Name",
                "Location",
                "Action",
              ].map((header, index) => (
                <th
                  key={index}
                  className="p-2 text-center border border-gray-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCustomerGroups.map((customerGroup, index) => (
              <tr
                key={index}
                className="bg-[#c6dceb] hover:bg-[#dce4e9] border border-gray-400"
              >
                <td className="p-2 text-center border border-gray-400">
                  {customerGroup.customerGroupName}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {customerGroup.assignSalesRepId || "N/A"}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {customerGroup.assignSalesRepName || "N/A"}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {customerGroup.location}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  <button
                    onClick={() => handleEdit(customerGroup.customerGroupId)}
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewCustomerGroup(customerGroup)}
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {/* Dummy Row */}
            <tr className="bg-[#f9f9f9] text-black italic">
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                CG-001
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                SR-004
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                V.J.Vimal
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                Weligama
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() => handleEdit("dummy")}
                >
                  Edit
                </button>
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() =>
                    handleViewCustomerGroup({ productId: "dummy" })
                  }
                >
                  View
                </button>
              </td>
            </tr>

            {/* Dummy Row */}
            <tr className="bg-[#f9f9f9] text-black italic">
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                CG-002
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                SR-005
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                L.T.Devin
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                Colombo
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() => handleEdit("dummy")}
                >
                  Edit
                </button>
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() =>
                    handleViewCustomerGroup({ productId: "dummy" })
                  }
                >
                  View
                </button>
              </td>
            </tr>
            {/* Dummy Row */}
            <tr className="bg-[#f9f9f9] text-black italic">
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                CG-012
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                SR-001
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                A.R.H.Hasith
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                Galle
              </td>
              <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() => handleEdit("dummy")}
                >
                  Edit
                </button>
                <button
                  className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  onClick={() =>
                    handleViewCustomerGroup({ productId: "dummy" })
                  }
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
CustomerGroupInfoTable.propTypes = {
  customerGroups: PropTypes.arrayOf(
    PropTypes.shape({
      customerGroupId: PropTypes.string.isRequired,
      customerGroupName: PropTypes.string.isRequired,
      assignSalesRepId: PropTypes.string.isRequired,
      assignSalesRepName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomerGroupInfoTable;
