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
  const [purchaseGroups, setPurchaseGroups] = useState([]); // State for purchase groups
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility

  // Fetch purchase groups on component mount
  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/purchase-groups/all", // Hypothetical endpoint
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
        setPurchaseGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching purchase groups:", error);
        setErrorMessage("Failed to fetch purchase groups.");
      }
    };

    fetchPurchaseGroups();
  }, []);

  // Populate form data with supplier details
  useEffect(() => {
    console.log("Supplier in Edit Form:", JSON.stringify(supplier, null, 2));
    if (supplier) {
      setFormData({
        supplier_name: supplier.supplier_name || "",
        supplier_address: supplier.supplier_address || "",
        supplier_contactNo: supplier.supplier_contactNo || "",
        purchase_group: supplier.purchase_group?.toString() || "", // Convert to string for input
        credit_period: supplier.credit_period?.toString() || "", // Convert to string for input
        credit_limit: supplier.credit_limit?.toString() || "", // Convert to string for input
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

  const handleSearch = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const handleSelectPurchaseGroup = (groupId) => {
    setFormData((prevData) => ({
      ...prevData,
      purchase_group: groupId.toString(), // Set the selected group ID as string
    }));
    setShowDropdown(false); // Hide dropdown after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.supplier_name ||
      !formData.supplier_address ||
      !formData.supplier_contactNo ||
      !formData.purchase_group ||
      !formData.credit_period ||
      !formData.credit_limit
    ) {
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

    // Convert fields to match backend entity types
    const phoneNo = formData.supplier_contactNo; // String
    const creditLimit = parseFloat(formData.credit_limit); // BigDecimal
    const creditPeriod = parseInt(formData.credit_period, 10); // Integer
    const purchaseGroup = parseInt(formData.purchase_group, 10); // Long (ID of PurchaseGroup)

    // Check for invalid numeric conversions
    if (isNaN(creditLimit) || isNaN(creditPeriod) || isNaN(purchaseGroup)) {
      setErrorMessage("Please ensure all numeric fields contain valid numbers.");
      return;
    }

    const requestData = {
      supplier_name: formData.supplier_name,
      supplier_address: formData.supplier_address,
      supplier_contactNo: phoneNo,
      purchase_group: purchaseGroup,
      credit_period: creditPeriod,
      credit_limit: creditLimit,
    };

    try {
      console.log("Submitting update for supplier_id:", supplier.supplier_id);
      console.log("Sending requestData:", JSON.stringify(requestData, null, 2));
      const response = await axios.put(
        `http://localhost:8090/api/suppliers/update/${supplier.supplier_id}`,
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

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="purchase_group" className="text-[16px] text-gray-800 w-2/3 text-left">
          Purchase Group ID:
        </label>
        <div className="relative flex items-center w-2/3">
          <input
            type="number" // Changed to number for Long ID
            id="purchase_group"
            name="purchase_group"
            value={formData.purchase_group}
            onChange={handleChange}
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
          />
          <button
            type="button" // Prevent form submission
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
          required
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
          required
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