/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { addCustomer, getAllCustomerGroups } from "../../../../../api/EmployeeApiService";

const AddCustomersForm = ({ onAddCustomer }) => {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD" for LocalDate
  };

  const validatePhoneNumber = (phone) => {
    // Sri Lankan phone number format (with or without country code)
    const phoneRegex = /^(?:\+94|0)?[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validateNIC = (nic) => {
    // Old NIC format: 9 digits + V/X
    const oldNICRegex = /^[0-9]{9}[vVxX]$/;
    // New NIC format: 12 digits
    const newNICRegex = /^[0-9]{12}$/;
    return oldNICRegex.test(nic) || newNICRegex.test(nic);
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
  const [customerGroups, setCustomerGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // New state for popup visibility
  const [isLoading, setIsLoading] = useState(false); // New state for submit button loading

  // Fetch customer groups with authentication check
  useEffect(() => {
    const fetchCustomerGroups = async () => {
      setIsLoadingGroups(true);
      try {
        const response = await getAllCustomerGroups();
        setCustomerGroups(response.data.data || []);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching customer groups:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMsg = error.response?.data?.message || 
          "Failed to fetch customer groups. Please ensure you're logged in and the server is running.";
        setErrorMessage(errorMsg);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      } finally {
        setIsLoadingGroups(false);
      }
    };
    fetchCustomerGroups();
  }, [navigate]);

  useEffect(() => {
    if (showPopup) {
      // Prevent scrolling on body when popup is shown
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when popup is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    if (!isLoadingGroups) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleSelectCustomerGroup = (groupId) => {
    setFormData((prevData) => ({
      ...prevData,
      customer_group: groupId.toString(),
    }));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const requiredFields = {
      customer_name: "Customer Name",
      customer_address: "Address",
      customer_contact_name: "Contact Name",
      customer_nic_no: "NIC",
      customer_brc_no: "BRC No",
      customer_email: "Email",
      customer_phone_no: "Phone Number",
      customer_group: "Customer Group",
      credit_limit: "Credit Limit",
      credit_period_in_days: "Credit Period",
      outstanding_balance: "Outstanding Balance",
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key] || (typeof formData[key] === 'string' && formData[key].trim() === "")) {
        setErrorMessage(`${label} is required.`);
        setIsLoading(false);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.customer_phone_no)) {
      setErrorMessage("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    if (!validateNIC(formData.customer_nic_no)) {
      setErrorMessage("Please enter a valid NIC number.");
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
      customer_phone_no: formData.customer_phone_no,
      customer_group: parseInt(formData.customer_group, 10),
      registered_date: formData.registered_date,
      credit_limit: parseFloat(formData.credit_limit),
      credit_period_in_days: parseInt(formData.credit_period_in_days, 10),
      outstanding_balance: parseFloat(formData.outstanding_balance),
    };

    if (
      isNaN(requestData.customer_group) ||
      isNaN(requestData.credit_limit) ||
      isNaN(requestData.credit_period_in_days) ||
      isNaN(requestData.outstanding_balance)
    ) {
      setErrorMessage("Please ensure all numeric fields are valid.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending requestData:", JSON.stringify(requestData, null, 2));
      const response = await addCustomer(requestData);
      console.log("Server response:", response.data);
      const savedCustomer = response.data.data;

      setSuccessMessage("Customer added successfully!");
      setErrorMessage("");
      setShowPopup(true); // Show the popup on success

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
        setShowPopup(false); // Hide the popup after 2 seconds
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add customer. Please try again.";
      setErrorMessage(errorMsg);
      console.error("Error adding customer:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  const handlePopupContinue = () => {
    setShowPopup(false); // Close the popup when the "CONTINUE" button is clicked
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
  };

  return (
    <div className="relative">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Add Customers
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="customer_name" className="text-[16px] text-gray-800 w-1/2 text-left">
                Customer Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="ABC1 Pharmacy"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_address" className="text-[16px] text-gray-800 w-1/2 text-left">
                Address: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_address"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                placeholder="Kandy"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_contact_name" className="text-[16px] text-gray-800 w-1/2 text-left">
                Contact Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_contact_name"
                name="customer_contact_name"
                value={formData.customer_contact_name}
                onChange={handleChange}
                placeholder="ABC1"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_nic_no" className="text-[16px] text-gray-800 w-1/2 text-left">
                NIC: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_nic_no"
                name="customer_nic_no"
                value={formData.customer_nic_no}
                onChange={handleChange}
                placeholder="123456789V or 200012345678"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_email" className="text-[16px] text-gray-800 w-1/2 text-left">
                Email: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="ABC1@gmail.com"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="customer_phone_no" className="text-[16px] text-gray-800 w-1/2 text-left">
                Phone Number: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_phone_no"
                name="customer_phone_no"
                value={formData.customer_phone_no}
                onChange={handleChange}
                placeholder="0714568978"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                maxLength="12"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="customer_group" className="text-[16px] text-gray-800 w-1/2 text-left">
                Customer Group ID: <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center w-1/2">
                <input
                  type="text"
                  id="customer_group"
                  name="customer_group"
                  value={formData.customer_group}
                  onChange={handleChange}
                  placeholder={isLoadingGroups ? "Loading groups..." : "Select group ID"}
                  className="w-full px-2 py-2 text-sm border border-red-300 rounded-md"
                  required
                  disabled={isLoadingGroups}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute text-green-500 cursor-pointer right-2"
                  aria-label="Search customer group"
                  disabled={isLoadingGroups}
                >
                  <FaSearch />
                </button>
                {showDropdown && !isLoadingGroups && (
                  <div className="absolute left-0 z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md top-10 max-h-40">
                    {customerGroups.length > 0 ? (
                      customerGroups.map((group) => (
                        <div
                          key={group.customerGroupId}
                          onClick={() => handleSelectCustomerGroup(group.customerGroupId)}
                          className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                        >
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
              <label htmlFor="customer_brc_no" className="text-[16px] text-gray-800 w-1/2 text-left">
                BRC No: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer_brc_no"
                name="customer_brc_no"
                value={formData.customer_brc_no}
                onChange={handleChange}
                placeholder="PV12345"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
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
                placeholder="YYYY-MM-DD"
                className="w-1/2 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="credit_limit" className="text-[16px] text-gray-800 w-1/2 text-left">
                Credit Limit: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="credit_limit"
                name="credit_limit"
                value={formData.credit_limit}
                onChange={handleChange}
                placeholder="10000.00"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="credit_period_in_days" className="text-[16px] text-gray-800 w-1/2 text-left">
                Credit Period In Days: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="credit_period_in_days"
                name="credit_period_in_days"
                value={formData.credit_period_in_days}
                onChange={handleChange}
                placeholder="30"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="outstanding_balance" className="text-[16px] text-gray-800 w-1/2 text-left">
                Outstanding Balance: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="outstanding_balance"
                name="outstanding_balance"
                value={formData.outstanding_balance}
                onChange={handleChange}
                placeholder="1000.00"
                className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
             style={{ overflow: 'hidden' }}>
          <div className="relative z-50 p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Green Checkmark Circle */}
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
              Customer added successfully!
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

AddCustomersForm.propTypes = {
  onAddCustomer: PropTypes.func.isRequired,
};

export default AddCustomersForm;