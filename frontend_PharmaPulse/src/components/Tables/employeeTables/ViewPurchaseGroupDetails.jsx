/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewPurchaseGroupDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchaseGroup = location.state?.purchaseGroup;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]">
        Purchase Group Details
      </h2>
      <div className="flex items-center justify-center mb-4"></div>
      <ul className="text-left ">
        <li>
          <strong>Purchase Group Name:</strong> {purchaseGroup.supplierName}
        </li>
        <li>
          <strong>Address:</strong> {purchaseGroup.address}
        </li>
        <li>
          <strong>Contact Name:</strong> {purchaseGroup.contactName}
        </li>
        <li>
          <strong>Telephone No:</strong> {purchaseGroup.telePhoneNo}
        </li>
        <li>
          <strong>Email:</strong> {purchaseGroup.email}
        </li>
        <li>
          <strong>Fax:</strong> {purchaseGroup.fax}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/purchase-group-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewPurchaseGroupDetails;
