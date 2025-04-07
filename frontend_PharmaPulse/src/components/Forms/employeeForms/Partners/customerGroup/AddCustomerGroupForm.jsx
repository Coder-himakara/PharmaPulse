/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { addCustomerGroups } from '../../../../../api/EmployeeApiService';

const AddCustomerGroupForm = ({ onAddCustomerGroup }) => {
  const [formData, setFormData] = useState({
    customerGroupName: "",
    assignedSalesRep: "",
    descriptions: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // New state for popup visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customerGroupName.trim() ||
      !formData.assignedSalesRep.trim() ||
      !formData.descriptions.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      console.log("Sending:", formData);
      const response = await addCustomerGroups(formData);

      const savedCustomerGroup = response.data.data;
      setErrorMessage("");
      setSuccessMessage("Customer group added successfully!");
      setShowPopup(true); // Show the popup on success

      if (onAddCustomerGroup) {
        onAddCustomerGroup(savedCustomerGroup);
      }

      setTimeout(() => {
        setFormData({
          customerGroupName: "",
          assignedSalesRep: "",
          descriptions: "",
        });
        setSuccessMessage("");
        setShowPopup(false); // Hide the popup after 2 seconds
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add customer group"
      );
      console.error("Error:", error.response || error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  const handlePopupContinue = () => {
    setShowPopup(false); // Close the popup when the "CONTINUE" button is clicked
    setFormData({
      customerGroupName: "",
      assignedSalesRep: "",
      descriptions: "",
    });
    setSuccessMessage("");
  };

  return (
    <div className="relative">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
      >
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Add Customer Group
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

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
            htmlFor="customerGroupName"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Customer Group Name: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerGroupName"
            name="customerGroupName"
            value={formData.customerGroupName}
            onChange={handleChange}
            placeholder="ABC1 Group"
            className="w-2/3 px-2 py-2 text-sm border border-red-300 rounded-md"
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="assignedSalesRep"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Assigned Sales Rep: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="assignedSalesRep"
            name="assignedSalesRep"
            value={formData.assignedSalesRep}
            onChange={handleChange}
            placeholder="Hashan"
            className="w-2/3 px-2 py-2 text-sm border border-red-300 rounded-md"
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <label
            htmlFor="descriptions"
            className="text-[16px] text-gray-800 w-1/3 text-left"
          >
            Location: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="descriptions"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            placeholder="Colombo"
            className="w-2/3 px-2 py-2 text-sm border border-red-300 rounded-md"
            required
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          >
            Add
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Green Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-green-500 rounded-full">
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
              Customer group added successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-green-500 rounded-md hover:bg-green-600"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AddCustomerGroupForm.propTypes = {
  onAddCustomerGroup: PropTypes.func.isRequired,
};

export default AddCustomerGroupForm;