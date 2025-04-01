/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewPurchaseGroupDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchaseGroup = location.state?.purchaseGroup;

  // Log the received purchaseGroup for debugging
  console.log("Purchase Group in View:", JSON.stringify(purchaseGroup, null, 2));

  // Redirect if no purchaseGroup is provided
  useEffect(() => {
    if (!purchaseGroup) {
      const timer = setTimeout(() => {
        navigate("/employee-dashboard/purchase-group-info");
      }, 2000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [purchaseGroup, navigate]);

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)] dark:text-black">
        Purchase Group Details
      </h2>
      {!purchaseGroup ? (
        <div className="p-5 text-center text-red-600">
          No purchase group data provided. Redirecting...
        </div>
      ) : (
        <>
          <ul className="space-y-2 text-left">
            <li>
              <strong>Purchase Group Name:</strong>{" "}
              {purchaseGroup.purchaseGroupName || "N/A"}
            </li>
            <li>
              <strong>Address:</strong>{" "}
              {purchaseGroup.purchaseGroupAddress || "N/A"}
            </li>
            <li>
              <strong>Contact Name:</strong>{" "}
              {purchaseGroup.purchaseGroupContactName || "N/A"}
            </li>
            <li>
              <strong>Phone Number:</strong>{" "}
              {purchaseGroup.purchaseGroupPhoneNo || "N/A"}
            </li>
            <li>
              <strong>Email:</strong>{" "}
              {purchaseGroup.purchaseGroupEmail || "N/A"}
            </li>
            <li>
              <strong>Fax:</strong>{" "}
              {purchaseGroup.purchaseGroupFaxNo || "N/A"}
            </li>
          </ul>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
              onClick={() => navigate("/employee-dashboard/purchase-group-info")}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPurchaseGroupDetails;