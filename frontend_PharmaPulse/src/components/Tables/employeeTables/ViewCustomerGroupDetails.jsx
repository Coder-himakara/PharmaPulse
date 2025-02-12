/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewCustomerGroupDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerGroups = location.state?.customerGroups;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
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
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/customer-group-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewCustomerGroupDetails;
