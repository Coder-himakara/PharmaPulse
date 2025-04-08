/* eslint-disable prettier/prettier */
import { useLocation, useNavigate } from "react-router-dom";

const ViewSupplierDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const supplier = location.state?.supplier;

  // Format phone number to ensure it starts with 0
  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A";
    const phoneStr = String(phone);
    return phoneStr.startsWith('0') ? phoneStr : '0' + phoneStr;
  };

  // Redirect if no supplier data is provided
  if (!supplier) {
    return (
      <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md text-center text-red-600">
        <p>No supplier data available.</p>
        <button
          className="px-5 py-2 mt-4 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/employee-dashboard/suppliers-info")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)] dark:text-black">
        Supplier Details
      </h2>
      <ul className="space-y-2 text-left">
        <li>
          <strong>Supplier Name:</strong> {supplier.supplier_name || "N/A"}
        </li>
        <li>
          <strong>Supplier Address:</strong> {supplier.supplier_address || "N/A"}
        </li>
        <li>
          <strong>Contact Number:</strong> {formatPhoneNumber(supplier.supplier_contactNo)}
        </li>
        <li>
          <strong>Email:</strong> {supplier.supplier_email || "N/A"}
        </li>
        {supplier.purchase_group && (
          <li>
            <strong>Purchase Group ID:</strong> {supplier.purchase_group}
          </li>
        )}
        <li>
          <strong>Credit Period (Days):</strong> {supplier.credit_period || "N/A"}
        </li>
        <li>
          <strong>Credit Limit:</strong> {supplier.credit_limit || "N/A"}
        </li>
        <li>
          <strong>Outstanding Balance:</strong> {supplier.outstanding_balance || "N/A"}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/employee-dashboard/suppliers-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewSupplierDetails;