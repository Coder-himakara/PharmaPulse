/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { updateCustomerGroups } from '../../../../../api/EmployeeApiService';

const EditCustomerGroupForm = ({ onUpdateCustomerGroup }) => {
  const { state } = useLocation();
  const customerGroup = state?.customerGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerGroupName: "",
    assignedSalesRep: "",
    descriptions: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!customerGroup) {
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

    if (
      !formData.customerGroupName.trim() ||
      !formData.assignedSalesRep.trim() ||
      !formData.descriptions.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const id = customerGroup.customerGroupId;
    if (!id) {
      setErrorMessage("Customer group ID is missing. Cannot update without an ID.");
      return;
    }

    // Match the backend DTO field names exactly
    const requestData = {
      customerGroupName: formData.customerGroupName,
      assignedSalesRep: formData.assignedSalesRep,
      descriptions: formData.descriptions,
    };

    try {
      const response = await updateCustomerGroups(id, requestData);
      setErrorMessage("");
      setSuccessMessage("Customer Group updated successfully!");

      if (onUpdateCustomerGroup) {
        onUpdateCustomerGroup(response.data.data || response.data);
      }

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/employee-dashboard/customer-group-info");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update customer group";
      setErrorMessage(errorMsg);
      console.error("Error updating customer group:", error);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customer-group-info");
  };

  const id = customerGroup.customerGroupId;
  if (!id) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Customer group ID is missing"}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Customer Group
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
      )}

      <div className="flex items-center mb-4">
        <label htmlFor="customerGroupName" className="text-[16px] text-gray-800 w-1/3 text-left">
          Customer Group Name:
        </label>
        <input
          type="text"
          id="customerGroupName"
          name="customerGroupName"
          value={formData.customerGroupName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <label htmlFor="assignedSalesRep" className="text-[16px] text-gray-800 w-1/3 text-left">
          Assigned Sales Rep:
        </label>
        <input
          type="text"
          id="assignedSalesRep"
          name="assignedSalesRep"
          value={formData.assignedSalesRep}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
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
        />
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="submit"
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
        >
          Update
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
  );
};

EditCustomerGroupForm.propTypes = {
  onUpdateCustomerGroup: PropTypes.func,
};

export default EditCustomerGroupForm;