/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Importing search icon

const AddSuppliersForm = ({ onAddSupplier }) => {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierAddress: "",
    contactNumber: "",
    purchaseGroup: "",
    creditPeriod: "",
    creditLimit: "",
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
    // Mock search action: You can implement navigation to a search page, filter results, or show a dialog
    console.log("Searching for purchase group:", formData.purchaseGroup);
    // Example: Navigate to a search page or filter results
    // navigate(`/search-purchase-group?query=${formData.purchaseGroup}`);
    alert(`Searching for purchase group: ${formData.purchaseGroup}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.supplierName ||
      !formData.supplierAddress ||
      !formData.contactNumber ||
      !formData.purchaseGroup ||
      !formData.creditPeriod ||
      !formData.creditLimit
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage(""); // Clear errors
    setSuccessMessage("Supplier added successfully!");

    // Pass the new supplier data to the parent
    if (onAddSupplier) {
      onAddSupplier(formData);
    }

    // Clear the form after a delay
    setTimeout(() => {
      setFormData({
        supplierName: "",
        supplierAddress: "",
        contactNumber: "",
        purchaseGroup: "",
        creditPeriod: "",
        creditLimit: "",
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
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Suppliers
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
          htmlFor="supplierName"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Supplier Name:
        </label>
        <input
          type="text"
          id="supplierName"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="supplierAddress"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Supplier Address:
        </label>
        <input
          type="text"
          id="supplierAddress"
          name="supplierAddress"
          value={formData.supplierAddress}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="contactNumber"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Contact Number:
        </label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="purchaseGroup"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Purchase Group:
        </label>
        <div className="relative flex items-center w-2/3">
          <input
            type="text"
            id="purchaseGroup"
            name="purchaseGroup"
            value={formData.purchaseGroup}
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
        <label
          htmlFor="creditPeriod"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Credit Period:
        </label>
        <input
          type="text"
          id="creditPeriod"
          name="creditPeriod"
          value={formData.creditPeriod}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="creditLimit"
          className="text-[16px] text-gray-800 w-2/3  text-left"
        >
          Credit Limit:
        </label>
        <input
          type="text"
          id="creditLimit"
          name="creditLimit"
          value={formData.creditLimit}
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