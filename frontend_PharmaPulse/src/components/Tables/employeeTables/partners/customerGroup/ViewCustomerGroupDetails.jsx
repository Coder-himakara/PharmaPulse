/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewCustomerGroupDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customerGroup = location.state?.customerGroup;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]  dark:text-black">
        Customer Group Details
      </h2>
      <div className="flex items-center justify-center mb-4"></div>
      <ul className="text-left ">
        <li>
          <strong>Customer Group Name:</strong>{" "}
          {customerGroup?.customerGroupName || "N/A"}
        </li>
        <li>
          <strong>Sales Rep ID:</strong>{" "}
          {customerGroup?.assignSalesRepId || "N/A"}
        </li>
        <li>
          <strong>Sales Rep Name:</strong>{" "}
          {customerGroup?.assignedSalesRep || "N/A"}
        </li>
        <li>
          <strong>Location:</strong>{" "}
          {customerGroup?.descriptions || "N/A"}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/employee-dashboard/customer-group-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewCustomerGroupDetails;