/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const AddCustomersForm = ({ onAddCustomer }) => {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
  };

  const [formData, setFormData] = useState({
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

  const handleSearch = () => {
    console.log("Searching for customer group:", formData.customer_group);
    alert(`Searching for customer group: ${formData.customer_group}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      !formData.customer_name ||
      !formData.customer_address ||
      !formData.customer_contact_name ||
      !formData.customer_nic_no ||
      !formData.customer_brc_no ||
      !formData.customer_email ||
      !formData.customer_phone_no ||
      !formData.customer_group ||
      !formData.credit_limit ||
      !formData.credit_period_in_days ||
      !formData.outstanding_balance
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    // Validate phone number format
    if (!/^0[0-9]{9}$/.test(formData.customer_phone_no)) {
      setErrorMessage("Phone number must start with 0 and contain exactly 10 digits.");
      return;
    }

    // Convert fields to match backend DTO types
    const phoneNo = parseInt(formData.customer_phone_no, 10);
    const group = parseInt(formData.customer_group, 10);
    const creditLimit = parseFloat(formData.credit_limit);
    const creditPeriod = parseInt(formData.credit_period_in_days, 10);
    const balance = parseFloat(formData.outstanding_balance);

    // Check for invalid numeric conversions
    if (isNaN(phoneNo) || isNaN(group) || isNaN(creditLimit) || isNaN(creditPeriod) || isNaN(balance)) {
      setErrorMessage("Please ensure all numeric fields contain valid numbers.");
      return;
    }

    const requestData = {
      ...formData,
      customer_phone_no: phoneNo,           // Integer
      customer_group: group,                // Long
      credit_limit: creditLimit,            // Double
      credit_period_in_days: creditPeriod,  // Integer
      outstanding_balance: balance,         // Double
    };

    setErrorMessage(""); // Clear previous errors
    try {
      console.log("Sending requestData:", JSON.stringify(requestData, null, 2));
      const response = await axios.post(
        "http://localhost:8090/api/customers/add",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          auth: {
            username: "admin",
            password: "admin123",
          },
        }
      );

      const savedCustomer = response.data.data;
      setSuccessMessage("Customer added successfully!");
      if (onAddCustomer) {
        onAddCustomer(savedCustomer);
      }

      setTimeout(() => {
        setFormData({
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
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An unexpected error occurred. Check the console for details.";
      setErrorMessage(errorMsg);
      console.error("Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: error.request,
      });
    }
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="customer_name" className="text-[16px] text-gray-800 w-1/2 text-left">
              Customer Name:
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_address" className="text-[16px] text-gray-800 w-1/2 text-left">
              Address:
            </label>
            <input
              type="text"
              id="customer_address"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_contact_name" className="text-[16px] text-gray-800 w-1/2 text-left">
              Contact Name:
            </label>
            <input
              type="text"
              id="customer_contact_name"
              name="customer_contact_name"
              value={formData.customer_contact_name}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_nic_no" className="text-[16px] text-gray-800 w-1/2 text-left">
              NIC:
            </label>
            <input
              type="text"
              id="customer_nic_no"
              name="customer_nic_no"
              value={formData.customer_nic_no}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_email" className="text-[16px] text-gray-800 w-1/2 text-left">
              Email:
            </label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_phone_no" className="text-[16px] text-gray-800 w-1/2 text-left">
              Phone Number:
            </label>
            <input
              type="text" // Changed to text for better control over format
              id="customer_phone_no"
              name="customer_phone_no"
              value={formData.customer_phone_no}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="customer_group" className="text-[16px] text-gray-800 w-1/2 text-left">
              Customer Group:
            </label>
            <div className="relative flex items-center w-1/2">
              <input
                type="number" // Changed to number since backend expects Long
                id="customer_group"
                name="customer_group"
                value={formData.customer_group}
                onChange={handleChange}
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
              />
              <button
                onClick={handleSearch}
                className="absolute text-green-500 cursor-pointer right-2"
                aria-label="Search customer group"
              >
                <FaSearch />
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="customer_brc_no" className="text-[16px] text-gray-800 w-1/2 text-left">
              BRC No:
            </label>
            <input
              type="text" // Changed to text to match backend String type
              id="customer_brc_no"
              name="customer_brc_no"
              value={formData.customer_brc_no}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="registered_date" className="text-[16px] text-gray-800 w-1/2 text-left">
              Registered Date:
            </label>
            <input
              type="text"
              id="registered_date"
              name="registered_date"
              value={formData.registered_date}
              readOnly
              className="w-1/2 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="credit_limit" className="text-[16px] text-gray-800 w-1/2 text-left">
              Credit Limit:
            </label>
            <input
              type="number"
              id="credit_limit"
              name="credit_limit"
              value={formData.credit_limit}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="credit_period_in_days" className="text-[16px] text-gray-800 w-1/2 text-left">
              Credit Period In Days:
            </label>
            <input
              type="number"
              id="credit_period_in_days"
              name="credit_period_in_days"
              value={formData.credit_period_in_days}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="outstanding_balance" className="text-[16px] text-gray-800 w-1/2 text-left">
              Outstanding Balance:
            </label>
            <input
              type="number"
              id="outstanding_balance"
              name="outstanding_balance"
              value={formData.outstanding_balance}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>
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