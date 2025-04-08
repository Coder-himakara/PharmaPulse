/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { updateCustomerGroups } from "../../../../../api/EmployeeApiService";

const EditCustomerGroupForm = ({ onUpdateCustomerGroup }) => {
  const { state } = useLocation();
  const customerGroup = state?.customerGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerGroupName: "",
    assignedSalesRep: "",
    descriptions: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!customerGroup || !customerGroup.customerGroupId) {
      setErrorMessage("No customer group data provided for editing.");
      navigate("/employee-dashboard/customer-group-info");
      return;
    }
    setFormData({
      customerGroupName: customerGroup.customerGroupName || "",
      assignedSalesRep: customerGroup.assignedSalesRep || "",
      descriptions: customerGroup.descriptions || "",
    });
  }, [customerGroup, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (
      !formData.customerGroupName.trim() ||
      !formData.assignedSalesRep.trim() ||
      !formData.descriptions.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    // Additional validation (e.g., max length)
    if (formData.customerGroupName.length > 50) {
      setErrorMessage("Customer Group Name must not exceed 50 characters.");
      setIsLoading(false);
      return;
    }
    if (formData.assignedSalesRep.length > 50) {
      setErrorMessage("Assigned Sales Rep must not exceed 50 characters.");
      setIsLoading(false);
      return;
    }
    if (formData.descriptions.length > 200) {
      setErrorMessage("Descriptions must not exceed 200 characters.");
      setIsLoading(false);
      return;
    }

    const id = customerGroup.customerGroupId;
    const requestData = {
      customerGroupName: formData.customerGroupName,
      assignedSalesRep: formData.assignedSalesRep,
      descriptions: formData.descriptions,
    };

    try {
      const response = await updateCustomerGroups(id, requestData);
      setSuccessMessage("Customer Group updated successfully!");
      setShowPopup(true);

      if (onUpdateCustomerGroup) {
        onUpdateCustomerGroup(response.data.data || response.data);
      }

      setTimeout(() => {
        setShowPopup(false);
        navigate("/employee-dashboard/customer-group-info");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update customer group";
      setErrorMessage(errorMsg);
      console.error("Error updating customer group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customer-group-info");
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    navigate("/employee-dashboard/customer-group-info");
  };

  if (!customerGroup?.customerGroupId) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Customer group ID is missing"}
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
          Edit Customer Group
        </h2>

        {errorMessage && (
          <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>
        )}
        {successMessage && !showPopup && (
          <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
        )}

        <div className="flex items-center mb-4">
          <label htmlFor="customerGroupName" className="text-[16px] text-gray-800 w-1/3 text-left">
            Group Name:
          </label>
          <input
            type="text"
            id="customerGroupName"
            name="customerGroupName"
            value={formData.customerGroupName}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="assignedSalesRep" className="text-[16px] text-gray-800 w-1/3 text-left">
            Sales Rep:
          </label>
          <input
            type="text"
            id="assignedSalesRep"
            name="assignedSalesRep"
            value={formData.assignedSalesRep}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="descriptions" className="text-[16px] text-gray-800 w-1/3 text-left">
            Descriptions:
          </label>
          <input
            type="text"
            id="descriptions"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={200}
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
              Customer Group updated successfully!
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

EditCustomerGroupForm.propTypes = {
  onUpdateCustomerGroup: PropTypes.func.isRequired,
};

export default EditCustomerGroupForm;