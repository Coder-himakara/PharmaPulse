/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewSupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const supplier = location.state?.supplier;

  if (!supplier) {
    return (
      <div className="p-5 text-center text-red-500">
        <h2>Supplier not found</h2>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/suppliers-info")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]">
        Supplier Details
      </h2>
      <div className="flex items-center justify-center mb-4"></div>
      <ul className="text-left ">
        <li>
          <strong>Supplier Name:</strong> {supplier.supplierName}
        </li>
        <li>
          <strong>Supplier Address:</strong> {supplier.supplierAddress}
        </li>
        <li>
          <strong> contactNumber:</strong> {supplier.contactNumber}
        </li>
        <li>
          <strong>Purchase Group:</strong> {supplier.purchaseGroup}
        </li>
        <li>
          <strong>Credit Period:</strong> {supplier.creditPeriod}
        </li>
        <li>
          <strong>Credit Limit:</strong> {supplier.creditLimit}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/suppliers-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewSupplierDetails;
