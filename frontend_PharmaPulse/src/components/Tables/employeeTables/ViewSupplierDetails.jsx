/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewSupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const supplier = location.state?.supplier;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
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
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/suppliers-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewSupplierDetails;
