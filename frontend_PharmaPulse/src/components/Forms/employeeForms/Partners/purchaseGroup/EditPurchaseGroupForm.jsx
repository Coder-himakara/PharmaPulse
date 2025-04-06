import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { updatePurchaseGroups } from "../../../../../api/EmployeeApiService";

const EditPurchaseGroupForm = ({ onUpdatePurchaseGroup }) => {
  const { state } = useLocation();
  const purchaseGroup = state?.purchaseGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseGroupName: "",
    purchaseGroupAddress: "",
    purchaseGroupContactName: "",
    purchaseGroupPhoneNo: "",
    purchaseGroupFaxNo: "",
    purchaseGroupEmail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!purchaseGroup || !purchaseGroup.purchaseGroupId) {
      setErrorMessage("No purchase group data provided for editing.");
      navigate("/employee-dashboard/purchase-group-info");
      return;
    }
    setFormData({
      purchaseGroupName: purchaseGroup.purchaseGroupName || "",
      purchaseGroupAddress: purchaseGroup.purchaseGroupAddress || "",
      purchaseGroupContactName: purchaseGroup.purchaseGroupContactName || "",
      purchaseGroupPhoneNo: purchaseGroup.purchaseGroupPhoneNo
        ? String(purchaseGroup.purchaseGroupPhoneNo)
        : "",
      purchaseGroupFaxNo: purchaseGroup.purchaseGroupFaxNo || "",
      purchaseGroupEmail: purchaseGroup.purchaseGroupEmail || "",
    });
  }, [purchaseGroup, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    const requiredFields = [
      "purchaseGroupName",
      "purchaseGroupAddress",
      "purchaseGroupContactName",
      "purchaseGroupPhoneNo",
      "purchaseGroupFaxNo",
      "purchaseGroupEmail",
    ];
    if (requiredFields.some((field) => !formData[field].trim())) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    // Phone number validation (10 digits starting with 0)
    if (!/^0[0-9]{9}$/.test(formData.purchaseGroupPhoneNo)) {
      setErrorMessage("Phone number must start with 0 and contain exactly 10 digits.");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.purchaseGroupEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Fax number validation (basic format, e.g., 10 digits)
    if (!/^[0-9]{10}$/.test(formData.purchaseGroupFaxNo)) {
      setErrorMessage("Fax number must contain exactly 10 digits.");
      setIsLoading(false);
      return;
    }

    const id = purchaseGroup.purchaseGroupId;
    if (!id) {
      setErrorMessage("Purchase group ID is missing.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      purchaseGroupName: formData.purchaseGroupName,
      purchaseGroupAddress: formData.purchaseGroupAddress,
      purchaseGroupContactName: formData.purchaseGroupContactName,
      purchaseGroupPhoneNo: parseInt(formData.purchaseGroupPhoneNo, 10),
      purchaseGroupFaxNo: formData.purchaseGroupFaxNo, // Kept as string since fax might not need parsing
      purchaseGroupEmail: formData.purchaseGroupEmail,
    };

    try {
      const response = await updatePurchaseGroups(id, requestData);
      setSuccessMessage("Purchase Group updated successfully!");
      setShowPopup(true);

      if (onUpdatePurchaseGroup) {
        onUpdatePurchaseGroup(response.data.data || response.data);
      }

      setTimeout(() => {
        setShowPopup(false);
        navigate("/employee-dashboard/purchase-group-info");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update purchase group"
      );
      console.error("Error updating purchase group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/purchase-group-info");
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    navigate("/employee-dashboard/purchase-group-info");
  };

  if (!purchaseGroup?.purchaseGroupId) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Invalid purchase group data"}
      </div>
    );
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Edit Purchase Group
        </h2>

        {errorMessage && (
          <p className="text-[#991919] text-sm font-bold mb-4 text-center">
            {errorMessage}
          </p>
        )}
        {successMessage && !showPopup && (
          <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
            {successMessage}
          </p>
        )}

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupName"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Name:
          </label>
          <input
            type="text"
            id="purchaseGroupName"
            name="purchaseGroupName"
            value={formData.purchaseGroupName}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupAddress"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Address:
          </label>
          <input
            type="text"
            id="purchaseGroupAddress"
            name="purchaseGroupAddress"
            value={formData.purchaseGroupAddress}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={100}
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupContactName"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Contact Name:
          </label>
          <input
            type="text"
            id="purchaseGroupContactName"
            name="purchaseGroupContactName"
            value={formData.purchaseGroupContactName}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupPhoneNo"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Phone Number:
          </label>
          <input
            type="tel"
            id="purchaseGroupPhoneNo"
            name="purchaseGroupPhoneNo"
            value={formData.purchaseGroupPhoneNo}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={10}
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupFaxNo"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Fax Number:
          </label>
          <input
            type="text"
            id="purchaseGroupFaxNo"
            name="purchaseGroupFaxNo"
            value={formData.purchaseGroupFaxNo}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={10}
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="purchaseGroupEmail"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Email:
          </label>
          <input
            type="email"
            id="purchaseGroupEmail"
            name="purchaseGroupEmail"
            value={formData.purchaseGroupEmail}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Orange Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-orange-500 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="mt-8 text-xl font-bold text-gray-800">SUCCESS</h3>
            <p className="mt-2 text-sm text-gray-600">
              Purchase Group updated successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EditPurchaseGroupForm.propTypes = {
  onUpdatePurchaseGroup: PropTypes.func.isRequired,
};

EditPurchaseGroupForm.defaultProps = {
  onUpdatePurchaseGroup: () => {},
};

export default EditPurchaseGroupForm;