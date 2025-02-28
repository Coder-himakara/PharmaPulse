/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Importing search icon

const EditCustomersForm = ({ onUpdateCustomer }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const customer = state?.customer; // Get customer from the state

  // Function to format date (DD-MMM-YYYY)
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
    registeredDate: formatDate(new Date()), // Default to current date if not provided
    creditLimit: "",
    creditPeriod: "",
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (customer) {
      setFormData({
        customerName: customer.customerName || "",
        address: customer.address || "",
        contactName: customer.contactName || "",
        nic: customer.nic || "",
        brcNo: customer.brcNo || "",
        email: customer.email || "",
        phoneNo: customer.phoneNo || "",
        customerGroup: customer.customerGroup || "",
        status: customer.status || "",
        registeredDate: customer.registeredDate
          ? formatDate(new Date(customer.registeredDate))
          : formatDate(new Date()),
        creditLimit: customer.creditLimit || "",
        creditPeriod: customer.creditPeriod || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
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

    setErrorMessage(""); // Clear errors

    // Pass the updated customer data to the parent
    if (onUpdateCustomer) {
      onUpdateCustomer(formData);
    }

    setSuccessMessage("Customer updated successfully!");

    // Redirect after update
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/customers-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customers-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Customer
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
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
            <label htmlFor="address" className="text-[16px] text-gray-800 w-1/2 text-left">
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
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
            <label htmlFor="nic" className="text-[16px] text-gray-800 w-1/2 text-left">
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
            <label htmlFor="brcNo" className="text-[16px] text-gray-800 w-1/2 text-left">
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
            <label htmlFor="email" className="text-[16px] text-gray-800 w-1/2 text-left">
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
            <label
              htmlFor="phoneNo"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
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
            <label htmlFor="status" className="text-[16px] text-gray-800 w-1/2 text-left">
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
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
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Credit Period:
            </label>
            <input
              type="text"
              id="creditPeriod"
              name="creditPeriod"
              value={formData.creditPeriod}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* Buttons at Bottom-Right */}
          <div className="flex justify-end gap-2 mt-4">
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
        </div>
      </div>
    </form>
  );
};

EditCustomersForm.propTypes = {
  onUpdateCustomer: PropTypes.func.isRequired,
};

export default EditCustomersForm;