/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { updateSuppliers, getAllPurchaseGroups } from "../../../../../api/EmployeeApiService";

const EditSuppliersForm = ({ onUpdateSupplier }) => {
  const { state } = useLocation();
  const supplier = state?.supplier;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_contactNo: "",
    supplier_email: "",
    purchase_group: "",
    credit_period: "",
    credit_limit: "",
    outstanding_balance: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await getAllPurchaseGroups();
        setPurchaseGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching purchase groups:", error);
        setErrorMessage("Failed to fetch purchase groups.");
      }
    };
    fetchPurchaseGroups();
  }, []);

  useEffect(() => {
    if (!supplier || !supplier.supplier_id) {
      setErrorMessage("No supplier data provided. Redirecting...");
      setTimeout(() => navigate("/employee-dashboard/suppliers-info"), 2000);
      return;
    }
    setFormData({
      supplier_name: supplier.supplier_name || "",
      supplier_address: supplier.supplier_address || "",
      supplier_contactNo: supplier.supplier_contactNo ? String(supplier.supplier_contactNo) : "",
      supplier_email: supplier.supplier_email || "",
      purchase_group: supplier.purchase_group?.purchaseGroupId?.toString() || supplier.purchase_group?.toString() || "",
      credit_period: supplier.credit_period ? String(supplier.credit_period) : "",
      credit_limit: supplier.credit_limit ? String(supplier.credit_limit) : "",
      outstanding_balance: supplier.outstanding_balance ? String(supplier.outstanding_balance) : "",
    });
  }, [supplier, navigate]);

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
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const requiredFields = [
      "supplier_name",
      "supplier_address",
      "supplier_contactNo",
      "supplier_email",
      "purchase_group",
    ];
    if (requiredFields.some((field) => !formData[field].trim())) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    // Validation
    if (!/^0[0-9]{9}$/.test(formData.supplier_contactNo)) {
      setErrorMessage("Contact number must start with 0 and contain exactly 10 digits.");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.supplier_email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const creditLimit = parseFloat(formData.credit_limit);
    const creditPeriod = parseInt(formData.credit_period, 10);
    const outstandingBalance = parseFloat(formData.outstanding_balance);
    
    if (formData.credit_limit && (isNaN(creditLimit) || creditLimit < 0)) {
      setErrorMessage("Credit limit must be a valid non-negative number.");
      setIsLoading(false);
      return;
    }
    if (formData.credit_period && (isNaN(creditPeriod) || creditPeriod < 0)) {
      setErrorMessage("Credit period must be a valid non-negative number.");
      setIsLoading(false);
      return;
    }
    if (formData.outstanding_balance && (isNaN(outstandingBalance) || outstandingBalance < 0)) {
      setErrorMessage("Outstanding balance must be a valid non-negative number.");
      setIsLoading(false);
      return;
    }

    const supplierId = supplier.supplier_id;
    const purchaseGroup = parseInt(formData.purchase_group, 10);

    if (isNaN(purchaseGroup)) {
      setErrorMessage("Please ensure Purchase Group ID contains a valid number.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      supplier_name: formData.supplier_name,
      supplier_address: formData.supplier_address,
      supplier_contactNo: formData.supplier_contactNo, // Keep as string to preserve leading zero
      supplier_email: formData.supplier_email,
      purchase_group: purchaseGroup,
      credit_period: formData.credit_period ? creditPeriod : null,
      credit_limit: formData.credit_limit ? creditLimit : null,
      outstanding_balance: formData.outstanding_balance ? outstandingBalance : null,
    };

    try {
      const response = await updateSuppliers(supplierId, requestData);
      setSuccessMessage("Supplier updated successfully!");
      setShowPopup(true);

      if (onUpdateSupplier) {
        onUpdateSupplier(response.data.data || response.data);
      }

      setTimeout(() => {
        setShowPopup(false);
        navigate("/employee-dashboard/suppliers-info");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update supplier");
      console.error("Error updating supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/suppliers-info");
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    navigate("/employee-dashboard/suppliers-info");
  };

  if (!supplier?.supplier_id) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Invalid supplier data"}
      </div>
    );
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Edit Supplier
        </h2>

        {errorMessage && (
          <p className="text-[#991919] text-sm font-bold mb-4 text-center">
            {errorMessage}
          </p>
        )}
        {successMessage && !showPopup && (
          <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
            {successMessage}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="supplier_name" className="text-[16px] text-gray-800 w-2/5 text-left">
            Supplier Name:
          </label>
          <input
            type="text"
            id="supplier_name"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleChange}
            placeholder="CIC1 Pharmacy"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={50}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="supplier_address" className="text-[16px] text-gray-800 w-2/5 text-left">
            Address:
          </label>
          <input
            type="text"
            id="supplier_address"
            name="supplier_address"
            value={formData.supplier_address}
            onChange={handleChange}
            placeholder="Kandy"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={100}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="supplier_contactNo" className="text-[16px] text-gray-800 w-2/5 text-left">
            Contact Number:
          </label>
          <input
            type="tel"
            id="supplier_contactNo"
            name="supplier_contactNo"
            value={formData.supplier_contactNo}
            onChange={handleChange}
            placeholder="0712458978"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
            maxLength={10}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="supplier_email" className="text-[16px] text-gray-800 w-2/5 text-left">
            Email:
          </label>
          <input
            type="email"
            id="supplier_email"
            name="supplier_email"
            value={formData.supplier_email}
            onChange={handleChange}
            placeholder="CIC@gmail.com"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="purchase_group" className="text-[16px] text-gray-800 w-2/5 text-left">
            Purchase Group ID:
          </label>
          <div className="relative flex items-center w-3/5">
            <input
              type="number"
              id="purchase_group"
              name="purchase_group"
              value={formData.purchase_group}
              onChange={handleChange}
              placeholder="1"
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
          <label htmlFor="credit_period" className="text-[16px] text-gray-800 w-2/5 text-left">
            Credit Period (Days):
          </label>
          <input
            type="number"
            id="credit_period"
            name="credit_period"
            value={formData.credit_period}
            onChange={handleChange}
            placeholder="7"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            min={0}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="credit_limit" className="text-[16px] text-gray-800 w-2/5 text-left">
            Credit Limit (Rs.):
          </label>
          <input
            type="number"
            id="credit_limit"
            name="credit_limit"
            value={formData.credit_limit}
            onChange={handleChange}
            placeholder="100000.00"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="outstanding_balance" className="text-[16px] text-gray-800 w-2/5 text-left">
            Outstanding Balance (Rs.):
          </label>
          <input
            type="number"
            id="outstanding_balance"
            name="outstanding_balance"
            value={formData.outstanding_balance}
            onChange={handleChange}
            placeholder="10000.00"
            className="w-3/5 px-2 py-2 text-sm border border-gray-300 rounded-md"
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Orange Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-green-500 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="mt-8 text-xl font-bold text-gray-800">SUCCESS</h3>
            <p className="mt-2 text-sm text-gray-600">
              Supplier updated successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-green-500 rounded-md hover:bg-green-600"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EditSuppliersForm.propTypes = {
  onUpdateSupplier: PropTypes.func.isRequired,
};

EditSuppliersForm.defaultProps = {
  onUpdateSupplier: () => {},
};

export default EditSuppliersForm;