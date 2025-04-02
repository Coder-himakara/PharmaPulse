/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { addSuppliers, getAllPurchaseGroups } from "../../../../../api/EmployeeApiService";

const AddSuppliersForm = ({ onAddSupplier }) => {
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_contactNo: "",
    supplier_email: "",
    outstanding_balance: "",
    credit_limit: "",
    credit_period: "",
    purchase_group: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch purchase groups
  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await getAllPurchaseGroups();
        console.log("Purchase groups response:", response.data);
        setPurchaseGroups(response.data.data || []);
        setErrorMessage("");
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to fetch purchase groups.";
        setErrorMessage(errorMsg);
        console.error("Error fetching purchase groups:", {
          status: error.response?.status,
          data: error.response?.data,
          fullError: error.response || error,
        });
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchPurchaseGroups();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelectPurchaseGroup = (groupId) => {
    setFormData((prevData) => ({
      ...prevData,
      purchase_group: groupId.toString(),
    }));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields (per SupplierDTO)
    const requiredFields = {
      supplier_name: "Supplier Name",
      supplier_address: "Supplier Address",
      supplier_contactNo: "Contact Number",
      supplier_email: "Email",
      purchase_group: "Purchase Group",
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key] || formData[key].trim() === "") {
        setErrorMessage(`${label} is required.`);
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.supplier_email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Prepare data with correct types for SupplierDTO
    const requestData = {
      supplier_name: formData.supplier_name,
      supplier_address: formData.supplier_address,
      supplier_contactNo: formData.supplier_contactNo, // String
      supplier_email: formData.supplier_email,
      outstanding_balance: formData.outstanding_balance ? parseFloat(formData.outstanding_balance) : null, // BigDecimal, nullable
      credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : null, // BigDecimal, nullable
      credit_period: formData.credit_period ? parseInt(formData.credit_period, 10) : null, // Integer, nullable
      purchase_group: parseInt(formData.purchase_group, 10), // Long
    };

    // Check for invalid numeric conversions
    if (
      (formData.outstanding_balance && isNaN(requestData.outstanding_balance)) ||
      (formData.credit_limit && isNaN(requestData.credit_limit)) ||
      (formData.credit_period && isNaN(requestData.credit_period)) ||
      isNaN(requestData.purchase_group)
    ) {
      setErrorMessage("Please ensure all numeric fields are valid.");
      return;
    }

    try {
      console.log("Sending requestData:", JSON.stringify(requestData, null, 2));
      const response = await addSuppliers(requestData);
      console.log("Server response:", response.data);
      const savedSupplier = response.data.data;

      setSuccessMessage("Supplier added successfully!");
      setErrorMessage("");

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
        status: error.response?.status,
        data: error.response?.data,
        fullError: error.response || error,
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
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
          required
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="purchase_group" className="text-[16px] text-gray-800 w-2/3 text-left">
          Purchase Group ID:
        </label>
        <div className="relative flex items-center w-2/3">
          <input
            type="text"
            id="purchase_group"
            name="purchase_group"
            value={formData.purchase_group}
            onChange={handleChange}
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute text-green-500 cursor-pointer right-2"
            aria-label="Search purchase group"
          >
            <FaSearch />
          </button>
          {showDropdown && (
            <div className="absolute left-0 z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md top-10 max-h-40">
              {purchaseGroups.length > 0 ? (
                purchaseGroups.map((group) => (
                  <div
                    key={group.purchaseGroupId}
                    onClick={() => handleSelectPurchaseGroup(group.purchaseGroupId)}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {group.purchaseGroupName} (ID: {group.purchaseGroupId})
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-500">No purchase groups available</div>
              )}
            </div>
          )}
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