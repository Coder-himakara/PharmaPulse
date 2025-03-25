/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddCustomerGroupForm = ({ onAddCustomerGroup }) => {
  const [formData, setFormData] = useState({
    customerGroupName: "",
    assignedSalesRep: "",
    descriptions: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
//async-The function always returns a promise.
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
      //axios.post-Send data to the backend using an API request 
      //await-await to pause execution until a promise resolves.
      const response = await axios.post(
        "http://localhost:8090/api/customer-groups/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Basic authentication
          auth: {
            username: "admin",
            password: "admin123"
          }
        }
      );

      const savedCustomerGroup = response.data.data;
      setErrorMessage("");
      setSuccessMessage("Customer group added successfully!");

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
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add customer group"
      );
      console.error("Error:", error.response || error);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Customer Group
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
          {successMessage}
        </p>
      )}

      <div className="flex items-center mb-4">
        <label
          htmlFor="customerGroupName"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Customer Group Name:
        </label>
        <input
          type="text"
          id="customerGroupName"
          name="customerGroupName"
          value={formData.customerGroupName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="assignedSalesRep"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Assigned Sales Rep:
        </label>
        <input
          type="text"
          id="assignedSalesRep"
          name="assignedSalesRep"
          value={formData.assignedSalesRep}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="descriptions"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
         Location:
        </label>
        <input
          type="text"
          id="descriptions"
          name="descriptions"
          value={formData.descriptions}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
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
  );
};

AddCustomerGroupForm.propTypes = {
  onAddCustomerGroup: PropTypes.func.isRequired,
};

export default AddCustomerGroupForm;