/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const AddSuppliersForm = ({ onAddSupplier }) => {
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_contactNo: "",
    supplier_email: "",
    outstanding_balance: "",
    credit_limit: "",
    credit_period: "",
    purchase_group: "", // Added to match the ManyToOne relationship
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
    console.log("Searching for purchase group:", formData.purchase_group);
    alert(`Searching for purchase group: ${formData.purchase_group}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.supplier_name ||
      !formData.supplier_address ||
      !formData.supplier_contactNo ||
      !formData.supplier_email || // Added validation for email
      !formData.outstanding_balance ||
      !formData.credit_limit ||
      !formData.credit_period ||
      !formData.purchase_group
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    // Validate phone number format
    if (!/^0[0-9]{9}$/.test(formData.supplier_contactNo)) {
      setErrorMessage("Phone number must start with 0 and contain exactly 10 digits.");
      return;
    }

    // Convert fields to match backend entity types
    const phoneNo = formData.supplier_contactNo; // Keep as String to preserve format
    const creditLimit = parseFloat(formData.credit_limit); // BigDecimal accepts number
    const creditPeriod = parseInt(formData.credit_period, 10); // Integer
    const balance = parseFloat(formData.outstanding_balance); // BigDecimal accepts number
    const purchaseGroup = parseInt(formData.purchase_group, 10); // Long (ID of PurchaseGroup)

    // Check for invalid numeric conversions
    if (isNaN(creditLimit) || isNaN(creditPeriod) || isNaN(balance) || isNaN(purchaseGroup)) {
      setErrorMessage("Please ensure all numeric fields contain valid numbers.");
      return;
    }

    const requestData = {
      supplier_name: formData.supplier_name,
      supplier_address: formData.supplier_address,
      supplier_contactNo: phoneNo, // String
      supplier_email: formData.supplier_email,
      outstanding_balance: balance, // BigDecimal
      credit_limit: creditLimit, // BigDecimal
      credit_period: creditPeriod, // Integer
      purchase_group: purchaseGroup, // Long (ID for ManyToOne relationship)
    };

    setErrorMessage(""); // Clear previous errors
    try {
      console.log("Sending requestData:", JSON.stringify(requestData, null, 2));
      const response = await axios.post(
        "http://localhost:8090/api/suppliers/add", // Hypothetical endpoint
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

      const savedSupplier = response.data.data;
      setSuccessMessage("Supplier added successfully!");
      if (onAddSupplier) {
        onAddSupplier(savedSupplier);
      }

      setTimeout(() => {
        setFormData({
          supplier_name: "",
          supplier_address: "",
          supplier_contactNo: "",
          supplier_email: "",
          outstanding_balance: "",
          credit_limit: "",
          credit_period: "",
          purchase_group: "",
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
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Suppliers
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="supplier_name" className="text-[16px] text-gray-800 w-2/3 text-left">
          Supplier Name:
        </label>
        <input
          type="text"
          id="supplier_name"
          name="supplier_name"
          value={formData.supplier_name}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="supplier_address" className="text-[16px] text-gray-800 w-2/3 text-left">
          Supplier Address:
        </label>
        <input
          type="text"
          id="supplier_address"
          name="supplier_address"
          value={formData.supplier_address}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="supplier_contactNo" className="text-[16px] text-gray-800 w-2/3 text-left">
          Contact Number:
        </label>
        <input
          type="text"
          id="supplier_contactNo"
          name="supplier_contactNo"
          value={formData.supplier_contactNo}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="supplier_email" className="text-[16px] text-gray-800 w-2/3 text-left">
          Email:
        </label>
        <input
          type="email"
          id="supplier_email"
          name="supplier_email"
          value={formData.supplier_email}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="purchase_group" className="text-[16px] text-gray-800 w-2/3 text-left">
          Purchase Group:
        </label>
        <div className="relative flex items-center w-2/3">
          <input
            type="number" // Changed to number for Long ID
            id="purchase_group"
            name="purchase_group"
            value={formData.purchase_group}
            onChange={handleChange}
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="absolute text-green-500 cursor-pointer right-2"
            aria-label="Search purchase group"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="credit_period" className="text-[16px] text-gray-800 w-2/3 text-left">
          Credit Period (Days):
        </label>
        <input
          type="number"
          id="credit_period"
          name="credit_period"
          value={formData.credit_period}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="credit_limit" className="text-[16px] text-gray-800 w-2/3 text-left">
          Credit Limit:
        </label>
        <input
          type="number"
          id="credit_limit"
          name="credit_limit"
          value={formData.credit_limit}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="outstanding_balance" className="text-[16px] text-gray-800 w-2/3 text-left">
          Outstanding Balance:
        </label>
        <input
          type="number"
          id="outstanding_balance"
          name="outstanding_balance"
          value={formData.outstanding_balance}
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

AddSuppliersForm.propTypes = {
  onAddSupplier: PropTypes.func.isRequired,
};

export default AddSuppliersForm;