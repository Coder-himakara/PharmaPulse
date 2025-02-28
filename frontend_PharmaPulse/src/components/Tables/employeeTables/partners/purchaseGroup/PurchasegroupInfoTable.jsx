/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PurchaseGroupInfoTable = ({ purchaseGroups }) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Combine the existing purchase groups with the dummy data
  const allPurchaseGroups = [
    ...purchaseGroups, // Existing purchase groups from props
    {
      purchaseGroupId: "PG-001",
      purchaseGroupName: "PG-001",
      address: "Main Road, Matara",
      contactName: "Arun",
      phoneNo: "0783456781",
      email: "arunde11@gmail.com",
      fax: "(123)-456-7890",
    },
    {
      purchaseGroupId: "PG-002",
      purchaseGroupName: "PG-002",
      address: "High Street, Colombo",
      contactName: "Lila",
      phoneNo: "0771234567",
      email: "lila@example.com",
      fax: "(234)-567-8901",
    },
    {
      purchaseGroupId: "PG-003",
      purchaseGroupName: "PG-003",
      address: "Park Lane, Kandy",
      contactName: "Ravi",
      phoneNo: "0769876543",
      email: "ravi@example.com",
      fax: "(345)-678-9012",
    },
    {
      purchaseGroupId: "PG-004",
      purchaseGroupName: "PG-004",
      address: "Beach Road, Galle",
      contactName: "Nisha",
      phoneNo: "0714567890",
      email: "nisha@example.com",
      fax: "(456)-789-0123",
    },
    {
      purchaseGroupId: "PG-005",
      purchaseGroupName: "PG-005",
      address: "Market Street, Jaffna",
      contactName: "Suren",
      phoneNo: "0702345678",
      email: "suren@example.com",
      fax: "(567)-890-1234",
    },
  ];

  // Filter the purchase groups based on the search term
  const filteredPurchaseGroups = allPurchaseGroups.filter((purchaseGroup) =>
    purchaseGroup.purchaseGroupName.toLowerCase().includes(search.toLowerCase())
  );

  // Close button action
  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  // Edit button action
  const handleEdit = (purchaseGroupId) => {
    const purchaseGroup = allPurchaseGroups.find(
      (pg) => pg.purchaseGroupId === purchaseGroupId
    );
    navigate(`/employee-dashboard/edit-purchase-group/${purchaseGroupId}`, {
      state: { purchaseGroup },
    });
  };

  const handleViewPurchaseGroup = (purchaseGroup) => {
    navigate(
      `/employee-dashboard/view-purchase-group/${purchaseGroup.purchaseGroupId}`,
      {
        state: { purchaseGroup },
      }
    );
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Purchase Groups Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Purchase Groups</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Purchase Group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {/* Display message when no search results */}
      {filteredPurchaseGroups.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No purchase groups found matching your search.
        </div>
      )}

      {/* Table displaying purchase groups */}
      <div className="p-2 overflow-x-auto">
        <table className="w-full border border-collapse border-gray-400">
          <thead>
            <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
              {[
                "Purchase Group Name",
                "Address",
                "Contact Name",
                "Phone Number",
                "Email",
                "Fax",
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
            {filteredPurchaseGroups.map((purchaseGroup, index) => (
              <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.purchaseGroupName}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.address}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.contactName}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.phoneNo}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.email}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.fax || "N/A"} {/* Handle fax if not provided */}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  <button
                    onClick={() => handleEdit(purchaseGroup.purchaseGroupId)}
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                    onClick={() => handleViewPurchaseGroup(purchaseGroup)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PurchaseGroupInfoTable.propTypes = {
  purchaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      purchaseGroupId: PropTypes.string.isRequired,
      purchaseGroupName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      contactName: PropTypes.string.isRequired,
      phoneNo: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      fax: PropTypes.string, // Optional, as it’s not always provided
    })
  ).isRequired,
};

export default PurchaseGroupInfoTable;