/* eslint-disable prettier/prettier */
import { useLocation, useNavigate } from "react-router-dom";

const ViewCustomerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  // Redirect if no customer data is provided
  if (!customer) {
    return (
      <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md text-center text-red-600">
        <p>No customer data available.</p>
        <button
          className="px-5 py-2 mt-4 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/employee-dashboard/customers-info")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)] dark:text-black">
        Customer Details
      </h2>
      <ul className="space-y-2 text-left">
        <li>
          <strong>Customer Name:</strong> {customer.customer_name || "N/A"}
        </li>
        <li>
          <strong>Address:</strong> {customer.customer_address || "N/A"}
        </li>
        <li>
          <strong>Contact Name:</strong> {customer.customer_contact_name || "N/A"}
        </li>
        <li>
          <strong>NIC:</strong> {customer.customer_nic_no || "N/A"}
        </li>
        <li>
          <strong>Business Registration No:</strong> {customer.customer_brc_no || "N/A"}
        </li>
        <li>
          <strong>Email:</strong> {customer.customer_email || "N/A"}
        </li>
        <li>
          <strong>Phone Number:</strong> {customer.customer_phone_no || "N/A"}
        </li>
        <li>
          <strong>Registered Date:</strong> {customer.registered_date || "N/A"}
        </li>
        <li>
          <strong>Credit Limit:</strong> {customer.credit_limit || "N/A"}
        </li>
        <li>
          <strong>Credit Period (Days):</strong> {customer.credit_period_in_days || "N/A"}
        </li>
        <li>
          <strong>Outstanding Balance:</strong> {customer.outstanding_balance || "N/A"}
        </li>
        {/* Optional fields not in provided DTO */}
        {customer.customer_group && (
          <li>
            <strong>Customer Group:</strong> {customer.customer_group}
          </li>
        )}
        {customer.status && (
          <li>
            <strong>Status:</strong> {customer.status}
          </li>
        )}
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/employee-dashboard/customers-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewCustomerDetails;