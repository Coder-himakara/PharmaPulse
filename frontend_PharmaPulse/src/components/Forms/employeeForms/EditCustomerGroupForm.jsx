/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditCustomerGroupForm = ({ onUpdateCustomerGroup }) => {
  const { state } = useLocation();
  const customerGroup = state?.customerGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerGroupName: "",
    assignSalesRepId: "",
    assignSalesRepName: "",
    location: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (customerGroup) {
      setFormData({
        customerGroupName: customerGroup.customerGroupName,
        assignSalesRepId: customerGroup.assignSalesRepId,
        assignSalesRepName: customerGroup.assignSalesRepName,
        location: customerGroup.location,
      });
    }
  }, [customerGroup]);

  const handleChange = (cg) => {
    const { name, value } = cg.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (cg) => {
    cg.preventDefault();

    if (
      !formData.customerGroupName.trim() ||
      !formData.assignSalesRepId.trim() ||
      !formData.assignSalesRepName.trim() ||
      !formData.location.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");

    if (onUpdateCustomerGroup) {
      onUpdateCustomerGroup(formData);
    }

    setSuccessMessage("Customer Group updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/customer-group-info"); // Navigate back to the list
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/customer-group-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Customer Group
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4">
          {successMessage}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="customerGroupName"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Customer Group Name:
        </label>
        <input
          type="text"
          id="customerGroupName"
          name="customerGroupName"
          value={formData.customerGroupName}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          readOnly
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="location" className="text-[16px] text-gray-800 w-2/3">
          Location:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="assignSalesRepId"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Assign Sales Rep:
        </label>
        <input
          type="text"
          id="assignSalesRepId"
          name="assignSalesRepId"
          value={formData.assignSalesRepId}
          onChange={handleChange}
          placeholder="Rep ID"
          className="w-1/3 px-3 py-2 mr-2 text-sm border border-gray-300 rounded-md"
        />
        <input
          type="text"
          id="assignSalesRepName"
          name="assignSalesRepName"
          value={formData.assignSalesRepName}
          onChange={handleChange}
          placeholder="Rep Name"
          className="w-1/3 px-3 py-2 text-sm border border-gray-300 rounded-md"
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
  customerGroup: PropTypes.object.isRequired,
  onUpdateCustomerGroup: PropTypes.func.isRequired,
};

export default EditCustomerGroupForm;
