/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { updateCustomers, getAllCustomerGroups } from "../../../../../api/EmployeeApiService";

const EditCustomersForm = ({ onUpdateCustomer }) => {
  const { state } = useLocation();
  const { customer, refreshData } = state || {};
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Converts to "YYYY-MM-DD" for LocalDate
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(?:\+94|0)?[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validateNIC = (nic) => {
    const oldNICRegex = /^[0-9]{9}[vVxX]$/;
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

  const [customerId, setCustomerId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const popupTimerRef = useRef(null);

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
        const errorMsg =
          error.response?.data?.message ||
          "Failed to fetch customer groups. Please ensure you're logged in and the server is running.";
        setErrorMessage(errorMsg);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setIsLoadingGroups(false);
      }
    };
    fetchCustomerGroups();
  }, [navigate]);

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
      customer_group:
        customer.customer_group?.customerGroupId?.toString() ||
        customer.customer_group ||
        "",
      registered_date: customer.registered_date
        ? formatDate(new Date(customer.registered_date))
        : formatDate(new Date()),
      credit_limit: customer.credit_limit ? String(customer.credit_limit) : "",
      credit_period_in_days: customer.credit_period_in_days
        ? String(customer.credit_period_in_days)
        : "",
      outstanding_balance: customer.outstanding_balance
        ? String(customer.outstanding_balance)
        : "",
    });
  }, [customer, navigate]);

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = () => {
    if (!isLoadingGroups) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleSelectCustomerGroup = (groupId) => {
    setFormData((prevData) => ({ ...prevData, customer_group: groupId.toString() }));
    setShowDropdown(false);
  };

  const handleUpdateSuccess = () => {
    console.log("Refreshing data with function:", refreshData);
    
    if (typeof refreshData === 'function') {
      try {
        refreshData();
        console.log("Refresh function called successfully");
      } catch (error) {
        console.error("Error calling refresh function:", error);
      }
    } else {
      console.warn("refreshData is not available or not a function");
    }
  };

  const handleSuccessfulUpdate = (updatedCustomer) => {
    setShowPopup(true);
    popupTimerRef.current = setTimeout(() => {
      setShowPopup(false);
      navigate('/employee-dashboard/customers-info', {
        state: { updatedCustomer: updatedCustomer, refreshNeeded: true }
      });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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

    if (!customerId) {
      setErrorMessage("Customer ID is missing. Cannot update without an ID.");
      setIsLoading(false);
      return;
    }

    let requestData;
    try {
      requestData = {
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
        throw new Error("One or more numeric fields have invalid values.");
      }
    } catch (error) {
      setErrorMessage("Please ensure all numeric fields are valid numbers.");
      console.error("Data formatting error:", error);
      setIsLoading(false);
      return;
    }

    console.log("Customer ID for update:", customerId);
    console.log("Sending update request:", JSON.stringify(requestData, null, 2));

    try {
      const response = await updateCustomers(customerId, requestData);
      const updatedCustomer = response.data.data || response.data;

      if (response && response.data) {
        console.log("Update successful, response:", response.data);
        
        setSuccessMessage("Customer updated successfully!");
        
        handleUpdateSuccess();
        
        if (onUpdateCustomer) {
          onUpdateCustomer(updatedCustomer);
        }
        
        handleSuccessfulUpdate(updatedCustomer);
      } else {
        throw new Error("Received empty response from server");
      }
    } catch (error) {
      setIsLoading(false);
      
      console.error("Error updating customer:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.statusText || 
                       error.message || 
                       "Failed to update customer. Network error or server timeout.";
      
      setErrorMessage(errorMsg);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customers-info");
  };

  const handlePopupContinue = () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    
    setShowPopup(false);
    navigate("/employee-dashboard/customers-info", { 
      state: { refreshNeeded: true, timestamp: new Date().getTime() } 
    });
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
        {successMessage && !showPopup && (
          <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
            {successMessage}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="customer_name"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Customer Name:
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="ABC1 Pharmacy"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_address"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Address:
              </label>
              <input
                type="text"
                id="customer_address"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                placeholder="Kandy"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_contact_name"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Contact Name:
              </label>
              <input
                type="text"
                id="customer_contact_name"
                name="customer_contact_name"
                value={formData.customer_contact_name}
                onChange={handleChange}
                placeholder="ABC1"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_nic_no"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                NIC:
              </label>
              <input
                type="text"
                id="customer_nic_no"
                name="customer_nic_no"
                value={formData.customer_nic_no}
                onChange={handleChange}
                placeholder="123456789V or 200012345678"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_email"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Email:
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="ABC1@gmail.com"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_phone_no"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Phone Number:
              </label>
              <input
                type="text"
                id="customer_phone_no"
                name="customer_phone_no"
                value={formData.customer_phone_no}
                onChange={handleChange}
                placeholder="0714568978"
                maxLength="12"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="customer_group"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Customer Group ID:
              </label>
              <div className="relative flex items-center w-1/2">
                <input
                  type="text"
                  id="customer_group"
                  name="customer_group"
                  value={formData.customer_group}
                  onChange={handleChange}
                  placeholder={
                    isLoadingGroups ? "Loading groups..." : "Select group ID"
                  }
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
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
                          onClick={() =>
                            handleSelectCustomerGroup(group.customerGroupId)
                          }
                          className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                        >
                          {group.customerGroupName} (ID: {group.customerGroupId})
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-gray-500">
                        No customer groups available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="customer_brc_no"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                BRC No:
              </label>
              <input
                type="text"
                id="customer_brc_no"
                name="customer_brc_no"
                value={formData.customer_brc_no}
                onChange={handleChange}
                placeholder="PV12345"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="registered_date"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Registered Date:
              </label>
              <input
                type="text"
                id="registered_date"
                name="registered_date"
                value={formData.registered_date}
                readOnly
                placeholder="YYYY-MM-DD"
                className="w-1/2 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="credit_limit"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Credit Limit:
              </label>
              <input
                type="number"
                id="credit_limit"
                name="credit_limit"
                value={formData.credit_limit}
                onChange={handleChange}
                placeholder="10000.00"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="credit_period_in_days"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Credit Period In Days:
              </label>
              <input
                type="number"
                id="credit_period_in_days"
                name="credit_period_in_days"
                value={formData.credit_period_in_days}
                onChange={handleChange}
                placeholder="30"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="outstanding_balance"
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                Outstanding Balance:
              </label>
              <input
                type="number"
                id="outstanding_balance"
                name="outstanding_balance"
                value={formData.outstanding_balance}
                onChange={handleChange}
                placeholder="1000.00"
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              />
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

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
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

            <h3 className="mt-8 text-xl font-bold text-gray-800">SUCCESS</h3>
            <p className="mt-2 text-sm text-gray-600">
              Customer updated successfully!
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Redirecting in 2 seconds...
            </p>

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