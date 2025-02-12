/* eslint-disable prettier/prettier */
import { useLocation, useNavigate } from "react-router-dom";

const ViewCustomerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  if (!customer) {
    return (
      <div className="p-5 text-center text-red-500">
        <h2>Customer not found</h2>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/customers-info")}
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
          <strong>Customer Name:</strong> {customer.customerName}
        </li>
        <li>
          <strong>Address:</strong> {customer.address}
        </li>
        <li>
          <strong>Contact Name:</strong> {customer.contactName}
        </li>
        <li>
          <strong>NIC:</strong> {customer.nic}
        </li>
        <li>
          <strong>BRC:</strong> {customer.brc}
        </li>
        <li>
          <strong>Email:</strong> {customer.email}
        </li>
        <li>
          <strong>Phone No:</strong> {customer.phoneNo}
        </li>
        <li>
          <strong>Customer Group:</strong> {customer.customerGroup}
        </li>
        <li>
          <strong>Status:</strong> {customer.status}
        </li>
        <li>
          <strong>Registered Date:</strong> {customer.registeredDate}
        </li>
        <li>
          <strong>Credit Limit:</strong> {customer.creditLimit}
        </li>
        <li>
          <strong>Credit Period:</strong> {customer.creditPeriod}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/customers-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewCustomerDetails;
