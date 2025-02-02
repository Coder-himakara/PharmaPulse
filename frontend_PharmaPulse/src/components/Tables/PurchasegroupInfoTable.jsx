/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PurchaseGroupInfoTable = ({ purchaseGroups }) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Filter the purchase groups based on the search term
  const filteredPurchaseGroups = purchaseGroups.filter((purchaseGroup) =>
    purchaseGroup.purchaseGroupName.toLowerCase().includes(search.toLowerCase())
  );

  // Close button action
  const handleClose = () => {
    navigate("/home");
  };

  // Edit button action
  const handleEdit = (purchaseGroupId) => {
    const purchaseGroup = purchaseGroups.find(
      (pg) => pg.purchaseGroupId === purchaseGroupId
    );
    navigate(`/edit-purchase-group/${purchaseGroupId}`, {
      state: { purchaseGroup },
    });
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
                "#",
                "Purchase Group ID",
                "Purchase Group Name",
                "Address",
                "Contact Name",
                "Telephone No",
                "Email",
                "Supplier ID",
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
                  {index + 1}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.purchaseGroupId}
                </td>
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
                  {purchaseGroup.telePhoneNo}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.email}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseGroup.supplierId}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  <button
                    onClick={() => handleEdit(purchaseGroup.purchaseGroupId)}
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md text-sm hover:bg-[#15375c]"
                  >
                    Edit
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
      telePhoneNo: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      supplierId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PurchaseGroupInfoTable;
