/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewCustomerGroupDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerGroups = location.state?.customerGroups;

  if (!customerGroups) {
    return (
      <div className="p-5 text-center text-red-500">
        <h2>Customer Group not found</h2>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/customer-group-info")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]">
        Customer Details
      </h2>
      <div className="flex items-center justify-center mb-4"></div>
      <ul className="text-left ">
        <li>
          <strong>Customer Group Id:</strong> {customerGroups.customerGroupId}
        </li>
        <li>
          <strong>Customer Group Name:</strong>{" "}
          {customerGroups.customerGroupName}
        </li>
        <li>
          <strong>Assign Sales Rep Id:</strong>{" "}
          {customerGroups.assignSalesRepId}
        </li>
        <li>
          <strong>Assign Sales Rep Name:</strong>{" "}
          {customerGroups.assignSalesRepName}
        </li>
        <li>
          <strong>Location:</strong> {customerGroups.location}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/customer-group-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewCustomerGroupDetails;
