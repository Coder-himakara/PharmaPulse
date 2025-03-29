/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const EditSuppliersForm = () => {
  const { state } = useLocation();
  const supplier = state?.supplier;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_contactNo: "",
    purchase_group: "",
    credit_period: "",
    credit_limit: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Supplier in Edit Form:", JSON.stringify(supplier, null, 2));
    if (supplier) {
      setFormData({
        supplier_name: supplier.supplier_name || "",
        supplier_address: supplier.supplier_address || "",
        supplier_contactNo: supplier.supplier_contactNo || "",
        purchase_group: supplier.purchase_group || "",
        credit_period: supplier.credit_period || "",
        credit_limit: supplier.credit_limit || "",
      });
    } else {
      setErrorMessage("No supplier data provided. Redirecting...");
      setTimeout(() => navigate("/employee-dashboard/suppliers-info"), 2000);
    }
  }, [supplier, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.supplier_name || !formData.purchase_group) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    if (!/^0[0-9]{9}$/.test(formData.supplier_contactNo)) {
      setErrorMessage("Contact number must start with 0 and contain exactly 10 digits.");
      return;
    }

    if (!supplier || supplier.supplier_id === undefined || supplier.supplier_id === null) {
      setErrorMessage("Cannot update: Supplier ID is missing.");
      return;
    }

    try {
      console.log("Submitting update for supplier_id:", supplier.supplier_id);
      const response = await axios.put(
        `http://localhost:8090/api/suppliers/update/${supplier.supplier_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: "admin", // Adjust credentials as needed
            password: "admin123",
          },
        }
      );
      console.log("Update Response:", JSON.stringify(response.data, null, 2));

      setSuccessMessage("Supplier updated successfully!");
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/employee-dashboard/suppliers-info");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update supplier"
      );
      console.error("Update Error:", error.response || error);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/suppliers-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Supplier
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
          required
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
          required
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
          required
        />
      </div>

      <div className="relative flex items-center justify-between mb-4">
        <label htmlFor="purchase_group" className="text-[16px] text-gray-800 w-2/3 text-left">
          Purchase Group:
        </label>
        <input
          type="text"
          id="purchase_group"
          name="purchase_group"
          value={formData.purchase_group}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 pr-8 text-sm border border-gray-300 rounded-md"
          required
        />
        <FaSearch className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="credit_period" className="text-[16px] text-gray-800 w-2/3 text-left">
          Credit Period (Months):
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
          Credit Limit (Rs.):
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

export default EditSuppliersForm;