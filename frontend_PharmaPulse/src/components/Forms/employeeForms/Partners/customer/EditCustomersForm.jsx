/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Importing search icon
import axios from "axios";

const EditCustomersForm = ({ onUpdateCustomer }) => {
  const { state } = useLocation();
  const customer = state?.customer;
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_address: "",
    customer_contact_name: "",
    customer_nic_no: "",
    customer_brc_no: "",
    customer_email: "",
    customer_phone_no: "",
    customer_group: "",
    registered_date: formatDate(new Date()),
    credit_limit: "",
    credit_period_in_days: "",
    outstanding_balance: "",
  });



  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (customer) {
      console.log("Received customer data:", customer);
      setFormData({
        customer_id: customer.customer_id || customer.customerId || "",
        customer_name: customer.customer_name || customer.customerName || "",
        customer_address: customer.customer_address || customer.address || "",
        customer_contact_name: customer.customer_contact_name || customer.contactName || "",
        customer_nic_no: customer.customer_nic_no || customer.nic || "",
        customer_brc_no: customer.customer_brc_no || customer.brcNo || "",
        customer_email: customer.customer_email || customer.email || "",
        customer_phone_no: customer.customer_phone_no || customer.phoneNo || "",
        customer_group: customer.customer_group || customer.customerGroup || "",
        registered_date: customer.registered_date
          ? formatDate(new Date(customer.registered_date))
          : formatDate(new Date()),
        credit_limit: customer.credit_limit || customer.creditLimit || "",
        credit_period_in_days: customer.credit_period_in_days || customer.creditPeriod || "",
        outstanding_balance: customer.outstanding_balance || customer.outstandingBalance || "",
      });
    } else {
      console.warn("No customer data received in state");
      setErrorMessage("No customer data available to edit.");
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debug submission

    // Basic validation
    if (
      !formData.customer_id ||
      !formData.customer_name.trim() ||
      !formData.customer_address.trim() ||
      !formData.customer_contact_name.trim() ||
      !formData.customer_nic_no.trim() ||
      !formData.customer_brc_no.trim() ||
      !formData.customer_email.trim() ||
      !formData.customer_phone_no.trim() ||
      !formData.customer_group.trim() ||
      !formData.credit_limit ||
      !formData.credit_period_in_days ||
      !formData.outstanding_balance
    ) {
      setErrorMessage("Please fill out all required fields.");
      console.log("Validation failed: Missing required fields");
      return;
    }
    if (!/^0[0-9]{9}$/.test(formData.customer_phone_no)) {
      setErrorMessage("Phone number must start with 0 and contain exactly 10 digits.");
      console.log("Validation failed: Invalid phone number format");
      return;
    }
    

    const phoneNo = parseInt(formData.customer_phone_no, 10);
    const group = parseInt(formData.customer_group, 10);
    const creditLimit = parseFloat(formData.credit_limit);
    const creditPeriod = parseInt(formData.credit_period_in_days, 10);
    const balance = parseFloat(formData.outstanding_balance);

    if (isNaN(phoneNo) || isNaN(group) || isNaN(creditLimit) || isNaN(creditPeriod) || isNaN(balance)) {
      setErrorMessage("Please ensure all numeric fields contain valid numbers.");
      console.log("Validation failed: Invalid numeric values");
      return;
    }

    const requestData = {
      ...formData,
      customer_phone_no: phoneNo,
      customer_group: group,
      credit_limit: creditLimit,
      credit_period_in_days: creditPeriod,
      outstanding_balance: balance,
    };

    try {
      console.log("Sending update request with data:", JSON.stringify(requestData, null, 2));
      const response = await axios.put(
        `http://localhost:8090/api/customers/${formData.customer_id}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: "admin",
            password: "admin123",
          },
        }
      );

      console.log("Update response:", response.data);

    setErrorMessage(""); // Clear errors
    setSuccessMessage("Customer updated successfully!");

    if (onUpdateCustomer) {
      onUpdateCustomer(response.data.data);
    }

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/customers-info");
    }, 2000);
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred while updating the customer.";
    setErrorMessage(errorMsg);
    console.error("Error updating customer:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config,
    });
  }
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
              readOnly
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
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
                readOnly
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
              />
              <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3" />
            </div>
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
              readOnly
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
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
              type="number"
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
              type="number"
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