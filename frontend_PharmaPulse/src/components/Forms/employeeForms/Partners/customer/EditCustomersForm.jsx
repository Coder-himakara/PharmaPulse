/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [customerGroups, setCustomerGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCustomerGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/customer-groups/all", {
          headers: { "Content-Type": "application/json" },
          auth: { username: "admin", password: "admin123" },
        });
        setCustomerGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching customer groups:", error);
        setErrorMessage("Failed to fetch customer groups.");
      }
    };
    fetchCustomerGroups();
  }, []);

  useEffect(() => {
    console.log("Location state:", state);
    console.log("Received customer:", customer);
    if (customer) {
      setCustomerId(customer.customer_id || customer.id || "");
      setFormData({
        customer_name: customer.customer_name || "",
        customer_address: customer.customer_address || "",
        customer_contact_name: customer.customer_contact_name || "",
        customer_nic_no: customer.customer_nic_no || "",
        customer_brc_no: customer.customer_brc_no || "",
        customer_email: customer.customer_email || "",
        customer_phone_no: customer.customer_phone_no ? String(customer.customer_phone_no) : "",
        customer_group: customer.customer_group?.customerGroupId?.toString() || customer.customer_group || "",
        registered_date: customer.registered_date ? formatDate(new Date(customer.registered_date)) : formatDate(new Date()),
        credit_limit: customer.credit_limit ? String(customer.credit_limit) : "",
        credit_period_in_days: customer.credit_period_in_days ? String(customer.credit_period_in_days) : "",
        outstanding_balance: customer.outstanding_balance ? String(customer.outstanding_balance) : "",
      });
    } else {
      console.warn("No customer data received in state");
      setErrorMessage("No customer data available to edit.");
      navigate("/customers-info");
    }
  }, [customer, navigate, state]);

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
    console.log("Form submitted with data:", formData);
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.customer_name.trim() ||
      !formData.customer_address.trim() ||
      !formData.customer_contact_name.trim() ||
      !formData.customer_nic_no.trim() ||
      !formData.customer_brc_no.trim() ||
      !formData.customer_email.trim() ||
      !formData.customer_phone_no.trim() ||
      !formData.customer_group.trim() ||
      !formData.credit_limit.trim() ||
      !formData.credit_period_in_days.trim() ||
      !formData.outstanding_balance.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      console.log("Missing fields:", formData);
      setIsLoading(false);
      return;
    }

    if (!/^0[0-9]{9}$/.test(formData.customer_phone_no)) {
      setErrorMessage("Phone number must start with 0 and contain exactly 10 digits.");
      console.log("Invalid phone number:", formData.customer_phone_no);
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
      console.log("Invalid numeric values:", { phoneNo, group, creditLimit, creditPeriod, balance });
      setIsLoading(false);
      return;
    }

    if (!customerId) {
      setErrorMessage("Customer ID is missing. Cannot update without an ID.");
      console.log("Missing customerId:", customerId);
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
      registered_date: formData.registered_date,
      credit_limit: creditLimit,
      credit_period_in_days: creditPeriod,
      outstanding_balance: balance,
    };

    try {
      const url = `http://localhost:8090/api/customers/update/${customerId}`;
      console.log("Sending PUT request to:", url);
      console.log("Request payload:", requestData);
      const response = await axios.put(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        auth: {
          username: "admin",
          password: "admin123",
        },
      });

      console.log("Update response:", response.data);
      setSuccessMessage("Customer updated successfully!");
      if (onUpdateCustomer) {
        onUpdateCustomer(response.data.data || response.data);
      }
      setTimeout(() => {
        console.log("Navigating back...");
        navigate("/customers-info");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update customer");
      console.error("Error updating customer:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/customers-info");
  };

  if (!customer) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "No customer data provided"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300">
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Customer
      </h2>
      {errorMessage && <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>}
      {successMessage && <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>}
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
            <input type="text" id="registered_date" name="registered_date" value={formData.registered_date} readOnly className="w-1/2 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md" />
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
  );
};

EditCustomersForm.propTypes = {
  onUpdateCustomer: PropTypes.func.isRequired,
};

export default EditCustomersForm;