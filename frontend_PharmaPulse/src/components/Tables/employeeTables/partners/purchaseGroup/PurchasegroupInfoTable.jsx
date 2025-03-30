/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PurchaseGroupInfoTable = ({ refreshTrigger }) => {
  const [search, setSearch] = useState("");
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        console.log("Fetching purchase groups...");
        const response = await axios.get(
          "http://localhost:8090/api/purchase-groups/all",
          {
            headers: {
              "Content-Type": "application/json",
            },
            auth: {
              username: "admin",
              password: "admin123",
            },
          }
        );
        console.log("Response:", response.data);
        setPurchaseGroups(response.data.data || []);
        setErrorMessage("");
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch purchase groups"
        );
        console.error("Error:", error.response || error);
        setLoading(false);
      }
    };

    fetchPurchaseGroups();
  }, [refreshTrigger]);

  const filteredPurchaseGroups = purchaseGroups.filter((purchaseGroup) =>
    (purchaseGroup.purchaseGroupName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  const handleEdit = (purchaseGroup) => {
    console.log("Editing purchase group:", purchaseGroup);
    navigate(`/employee-dashboard/edit-purchase-group/${purchaseGroup.purchaseGroupId}`, {
      state: { purchaseGroup },
    });
  };

  const handleViewPurchaseGroup = (purchaseGroup) => {
    console.log("Viewing purchase group:", purchaseGroup);
    navigate(
      `/employee-dashboard/view-purchase-group/${purchaseGroup.purchaseGroupId}`,
      {
        state: { purchaseGroup },
      }
    );
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-800">Loading purchase groups...</div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md">
      <div className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg relative">
        <h1 className="text-lg">Purchase Groups Management</h1>
        <button
          onClick={handleClose}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-2xl cursor-pointer hover:text-[#f1f1f1]"
        >
          X
        </button>
      </div>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] text-gray-800 font-bold">Purchase Groups</h2>
        <input
          type="text"
          placeholder="Search Purchase Group Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      {filteredPurchaseGroups.length === 0 && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {search ? "No purchase groups found matching your search." : "No purchase groups available."}
        </p>
      )}

      {filteredPurchaseGroups.length > 0 && (
        <div className="overflow-x-auto">
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
                <tr
                  key={index}
                  className="bg-[#c6dceb] hover:bg-[#dce4e9] border border-gray-400"
                >
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupName || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupAddress || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupContactName || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupPhoneNo || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupEmail || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {purchaseGroup.purchaseGroupFaxNo || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    <div className="flex justify-center gap-x-2">
                      <button
                        onClick={() => handleEdit(purchaseGroup)}
                        className="px-4 py-1 bg-[#2a4d69] text-white border-none rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewPurchaseGroup(purchaseGroup)}
                        className="px-4 py-1 bg-[#2a4d69] text-white border-none rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

PurchaseGroupInfoTable.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default PurchaseGroupInfoTable;