/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerGroupInfoTable = ({ refreshTrigger }) => {
  const [search, setSearch] = useState("");
  const [customerGroups, setCustomerGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerGroups = async () => {
      try {
        console.log("Fetching customer groups...");
        const response = await axios.get(
          "http://localhost:8090/api/customer-groups/all",
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
        setCustomerGroups(response.data.data || []);
        setErrorMessage("");
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch customer groups"
        );
        console.error("Error:", error.response || error);
        setLoading(false);
      }
    };

    fetchCustomerGroups();
  }, [refreshTrigger]);

  const filteredCustomerGroups = customerGroups.filter((customerGroup) =>
    (customerGroup.customerGroupName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  const handleEdit = (customerGroup) => {
    console.log("Editing customer group:", customerGroup);
    navigate(`/employee-dashboard/edit-customer-group/${customerGroup.customerGroupId}`, {
      state: { customerGroup },
    });
  };

  const handleViewCustomerGroup = (customerGroup) => {
    navigate(`/employee-dashboard/view-customer-group/${customerGroup.customerGroupId}`, {
      state: { customerGroup },
    });
  };

  if (loading) {
    return <div className="p-5 text-center text-gray-800">Loading customer groups...</div>;
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md">
      <div className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg relative">
        <h1 className="text-lg">Customer Groups Management</h1>
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
        <h2 className="text-[16px] text-gray-800 font-bold">Customer Groups</h2>
        <input
          type="text"
          placeholder="Search Customer Group Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      {filteredCustomerGroups.length === 0 && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {search ? "No customer groups found matching your search." : "No customer groups available."}
        </p>
      )}

      {filteredCustomerGroups.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-400">
            <thead>
              <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
                {[
                  "Customer Group Name",
                  "Assigned Sales Rep",
                  "Descriptions",
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
                    {customerGroup.customerGroupName || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {customerGroup.assignedSalesRep || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {customerGroup.descriptions || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    <button
                      onClick={() => handleEdit(customerGroup)}
                      className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewCustomerGroup(customerGroup)}
                      className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
                    >
                      View
                    </button>
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

CustomerGroupInfoTable.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default CustomerGroupInfoTable;