/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Importing search icon

const AddCustomersForm = ({ onAddCustomer }) => {
  const formatDate = (date) => {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-"); // Example: 11-Feb-2025
  };

  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    contactName: "",
    nic: "",
    brcNo: "",
    email: "",
    phoneNo: "",
    customerGroup: "",
    status: "",
    registeredDate: formatDate(new Date()), // Set current date
    creditLimit: "",
    creditPeriod: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if all required fields are filled
    if (
      !formData.customerName ||
      !formData.address ||
      !formData.contactName ||
      !formData.nic ||
      !formData.brcNo ||
      !formData.email ||
      !formData.phoneNo ||
      !formData.customerGroup ||
      !formData.status ||
      !formData.registeredDate ||
      !formData.creditLimit ||
      !formData.creditPeriod
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Customer added successfully!");

    if (onAddCustomer) {
      onAddCustomer(formData);
    }

    setTimeout(() => {
      setFormData({
        customerName: "",
        address: "",
        contactName: "",
        nic: "",
        brcNo: "",
        email: "",
        phoneNo: "",
        customerGroup: "",
        status: "",
        registeredDate: formatDate(new Date()), // Reset with the current date
        creditLimit: "",
        creditPeriod: "",
      });
      setSuccessMessage("");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Customers
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

      {/* Form Grid Layout mimicking the invoice structure */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="customerName"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Customer Name:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="address" className="text-[16px] text-gray-800 w-1/2">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="contactName"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Contact Name:
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="nic" className="text-[16px] text-gray-800 w-1/2">
              NIC:
            </label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="brcNo" className="text-[16px] text-gray-800 w-1/2">
              Businesses Registration Number:
            </label>
            <input
              type="text"
              id="brcNo"
              name="brcNo"
              value={formData.brcNo}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="email" className="text-[16px] text-gray-800 w-1/2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Right Column with Buttons at the Bottom */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="phoneNo" className="text-[16px] text-gray-800 w-1/2">
              Phone Number:
            </label>
            <input
              type="number"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="customerGroup"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Customer Group:
            </label>
            <div className="relative w-1/2">
              <input
                type="text"
                id="customerGroup"
                name="customerGroup"
                value={formData.customerGroup}
                onChange={handleChange}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
              />
              <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3" />
            </div>
          </div>

          <div className="flex items-center">
            <label htmlFor="status" className="text-[16px] text-gray-800 w-1/2">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a status</option>
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
              <option value="suspended">SUSPENDED</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="registeredDate"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Registered Date:
            </label>
            <input
              type="text"
              id="registeredDate"
              name="registeredDate"
              value={formData.registeredDate}
              readOnly
              className="w-1/2 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="creditLimit"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Credit Limit:
            </label>
            <input
              type="text"
              id="creditLimit"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="creditPeriod"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Credit Period:
            </label>
            <input
              type="number"
              id="creditPeriod"
              name="creditPeriod"
              value={formData.creditPeriod}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>

          {/* Buttons at Bottom-Right */}
          <div className="flex justify-end gap-2 mt-4">
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
        </div>
      </div>
    </form>
  );
};

AddCustomersForm.propTypes = {
  onAddCustomer: PropTypes.func.isRequired,
};

export default AddCustomersForm;