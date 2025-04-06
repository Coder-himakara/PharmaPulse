/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { updateCustomers, getAllCustomerGroups } from "../../../../../api/EmployeeApiService";

const EditCustomersForm = ({ onUpdateCustomer }) => {
  const { state } = useLocation();
  const customer = state?.customer;
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD" for LocalDate
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

  const [customerId, setCustomerId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCustomerGroups = async () => {
      try {
        const response = await getAllCustomerGroups();
        setCustomerGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching customer groups:", error);
        setErrorMessage("Failed to fetch customer groups.");
      }
    };
    fetchCustomerGroups();
  }, []);

  useEffect(() => {
    if (!customer) {
      setErrorMessage("No customer data available to edit.");
      navigate("/employee-dashboard/customers-info");
      return;
    }
    setCustomerId(customer.customer_id || "");
    setFormData({
      customer_name: customer.customer_name || "",
      customer_address: customer.customer_address || "",
      customer_contact_name: customer.customer_contact_name || "",
      customer_nic_no: customer.customer_nic_no || "",
      customer_brc_no: customer.customer_brc_no || "",
      customer_email: customer.customer_email || "",
      customer_phone_no: customer.customer_phone_no || "",
      customer_group: customer.customer_group?.customerGroupId?.toString() || customer.customer_group || "",
      registered_date: customer.registered_date ? formatDate(new Date(customer.registered_date)) : formatDate(new Date()),
      credit_limit: customer.credit_limit ? String(customer.credit_limit) : "",
      credit_period_in_days: customer.credit_period_in_days ? String(customer.credit_period_in_days) : "",
      outstanding_balance: customer.outstanding_balance ? String(customer.outstanding_balance) : "",
    });
  }, [customer, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelectCustomerGroup = (groupId) => {
    setFormData((prevData) => ({ ...prevData, customer_group: groupId.toString() }));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation for editable fields (excluding registered_date)
    const requiredFields = [
      "customer_name", "customer_address", "customer_contact_name",
      "customer_nic_no", "customer_brc_no", "customer_email",
      "customer_phone_no", "customer_group", "credit_limit",
      "credit_period_in_days", "outstanding_balance"
    ];
    
    if (requiredFields.some(field => !formData[field].trim())) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const phoneNo = parseInt(formData.customer_phone_no, 10);
    const group = parseInt(formData.customer_group, 10);
    const creditLimit = parseFloat(formData.credit_limit);
    const creditPeriod = parseInt(formData.credit_period_in_days, 10);
    const balance = parseFloat(formData.outstanding_balance);

    if (isNaN(phoneNo) || isNaN(group) || isNaN(creditLimit) || isNaN(creditPeriod) || isNaN(balance)) {
      setErrorMessage("Please ensure all numeric fields contain valid numbers.");
      setIsLoading(false);
      return;
    }

    if (!customerId) {
      setErrorMessage("Customer ID is missing. Cannot update without an ID.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      customer_name: formData.customer_name,
      customer_address: formData.customer_address,
      customer_contact_name: formData.customer_contact_name,
      customer_nic_no: formData.customer_nic_no,
      customer_brc_no: formData.customer_brc_no,
      customer_email: formData.customer_email,
      customer_phone_no: phoneNo,
      customer_group: group,
      registered_date: formData.registered_date, // Sent as-is since it's read-only
      credit_limit: creditLimit,
      credit_period_in_days: creditPeriod,
      outstanding_balance: balance,
    };

    try {
      const response = await updateCustomers(customerId, requestData);
      
      setSuccessMessage("Customer updated successfully!");
      setShowPopup(true);

      if (onUpdateCustomer) {
        onUpdateCustomer(response.data.data || response.data);
      }
      setTimeout(() => {
        setShowPopup(false);
        navigate("/employee-dashboard/customers-info");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update customer");
      console.error("Error updating customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customers-info");
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    navigate("/employee-dashboard/customers-info");
  };

  if (!customer || !customerId) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Invalid customer data"}
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300">
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Edit Customer
        </h2>
        {errorMessage && <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>}
        {successMessage && !showPopup && <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="customer_name" className="text-[16px] text-gray-800 w-1/2 text-left">Customer Name:</label>
              <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_address" className="text-[16px] text-gray-800 w-1/2 text-left">Address:</label>
              <input type="text" id="customer_address" name="customer_address" value={formData.customer_address} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_contact_name" className="text-[16px] text-gray-800 w-1/2 text-left">Contact Name:</label>
              <input type="text" id="customer_contact_name" name="customer_contact_name" value={formData.customer_contact_name} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_nic_no" className="text-[16px] text-gray-800 w-1/2 text-left">NIC:</label>
              <input type="text" id="customer_nic_no" name="customer_nic_no" value={formData.customer_nic_no} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_email" className="text-[16px] text-gray-800 w-1/2 text-left">Email:</label>
              <input type="email" id="customer_email" name="customer_email" value={formData.customer_email} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_phone_no" className="text-[16px] text-gray-800 w-1/2 text-left">Phone Number:</label>
              <input type="text" id="customer_phone_no" name="customer_phone_no" value={formData.customer_phone_no} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="customer_group" className="text-[16px] text-gray-800 w-1/2 text-left">Customer Group ID:</label>
              <div className="relative flex items-center w-1/2">
                <input type="number" id="customer_group" name="customer_group" value={formData.customer_group} onChange={handleChange} className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md" required />
                <button type="button" onClick={handleSearch} className="absolute text-green-500 cursor-pointer right-2" aria-label="Search customer group">
                  <FaSearch />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md top-10 max-h-40">
                    {customerGroups.length > 0 ? (
                      customerGroups.map((group) => (
                        <div key={group.customerGroupId} onClick={() => handleSelectCustomerGroup(group.customerGroupId)} className="px-2 py-1 cursor-pointer hover:bg-gray-100">
                          {group.customerGroupName} (ID: {group.customerGroupId})
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-gray-500">No customer groups available</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_brc_no" className="text-[16px] text-gray-800 w-1/2 text-left">BRC No:</label>
              <input type="text" id="customer_brc_no" name="customer_brc_no" value={formData.customer_brc_no} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="registered_date" className="text-[16px] text-gray-800 w-1/2 text-left">Registered Date:</label>
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
              <label htmlFor="credit_limit" className="text-[16px] text-gray-800 w-1/2 text-left">Credit Limit:</label>
              <input type="number" id="credit_limit" name="credit_limit" value={formData.credit_limit} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="credit_period_in_days" className="text-[16px] text-gray-800 w-1/2 text-left">Credit Period In Days:</label>
              <input type="number" id="credit_period_in_days" name="credit_period_in_days" value={formData.credit_period_in_days} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex items-center">
              <label htmlFor="outstanding_balance" className="text-[16px] text-gray-800 w-1/2 text-left">Outstanding Balance:</label>
              <input type="number" id="outstanding_balance" name="outstanding_balance" value={formData.outstanding_balance} onChange={handleChange} className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md" required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
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
                className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Orange Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-orange-500 rounded-full">
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
              Customer updated successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EditCustomersForm.propTypes = {
  onUpdateCustomer: PropTypes.func,
};

EditCustomersForm.defaultProps = {
  onUpdateCustomer: () => {},
};

export default EditCustomersForm;