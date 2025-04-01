/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReportForm = ({ onGenerateReport }) => {
  const [formData, setFormData] = useState({
    employee: "Hashan",
    fromDate: "2024-12-01", // Updated to ISO format (YYYY-MM-DD) for date input
    toDate: "2024-12-12",   // Updated to ISO format (YYYY-MM-DD) for date input
    group: "",
    days: "",
    customers: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.employee || !formData.fromDate || !formData.toDate) {
      setErrorMessage("Please fill out all required fields (Employee, From Date, To Date).");
      return;
    }

    // Simulate a successful submission
    const newReport = {
      ...formData,
    };

    setSuccessMessage("Report generated successfully!");
    if (onGenerateReport) {
      onGenerateReport(newReport);
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        employee: "",
        fromDate: "",
        toDate: "",
        group: "",
        days: "",
        customers: "",
      });
      setSuccessMessage("");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  // Color scheme from the original ReportForm
  const colors = {
    background: "bg-[#e6eef3]", // Light blue background
    headerBg: "bg-[#1a5353]", // Dark teal header background
    textWhite: "text-white", // White text
    inputBorder: "border-black", // Black border for inputs
    buttonBg: "bg-[#4c85a6]", // Button background
    buttonHover: "hover:bg-[#15375c]", // Button hover background
    dropdownBg: "bg-white", // White dropdown background
    dropdownText: "text-black", // Black dropdown text
    sectionBg: "bg-white", // White background for sections
    border: "border-gray-300", // Gray border for sections
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md"
      >
        {/* Header */}
        <h2
          className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
          Outstanding Report
        </h2>

        {errorMessage && (
          <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Section */}
          <div className={`p-4 ${colors.sectionBg} ${colors.border} rounded-md`}>
            <h3 className="mb-2 text-sm font-bold">DETAIL REPORT FOR ALL CUSTOMERS</h3>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-800">Employee:</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Select Employee</option>
                <option value="Hashan">Hashan</option>
                <option value="Amal">Amal</option>
                <option value="Kasun">Kasun</option>
                
                {/* Add more employees as needed */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-800">Date Range:</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className={`w-1/2 px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
                />
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  className={`w-1/2 px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
                />
              </div>
            </div>
         
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-800">Days:</label>
              <input
                type="number"
                value={formData.days}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className={`p-4 ${colors.sectionBg} ${colors.border} rounded-md`}>
            <h3 className="mb-2 text-sm font-bold">SELECTED CUSTOMER LIST</h3>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-800">Location:</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Select Customer</option>
                <option value="LB-8062">LB-8062 Hasban</option>
                <option value="LG-7782">LG-7782 Santh OLD</option>
                {/* Add more customers as needed */}
              </select>
            </div>
          </div>
        </div>

        {/* Customer Dropdown Section */}
        <div className={`p-4 mt-4 ${colors.sectionBg} ${colors.border} rounded-md`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-800">Customer:</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Select Customer</option>
                <option value="NEW MULTI DRUGS">NEW MULTI DRUGS</option>
                <option value="A & J PHARMACY & GROCERY">A & J PHARMACY & GROCERY</option>
                <option value="A K PHARMACY (PVT) LTD">A K PHARMACY (PVT) LTD</option>
                <option value="A S G KULADI ANJANA">A S G KULADI ANJANA</option>
                <option value="ABHAYA PHARMACY">ABHAYA PHARMACY</option>
                <option value="AJANTHA OSUSALA">AJANTHA OSUSALA</option>
                {/* Add more customers as needed */}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-800">Group:</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Select Group</option>
                <option value="AGALAWATTA">AGALAWATTA</option>
                <option value="AGULU KOPALASSA">AGULU KOPALASSA</option>
                <option value="AHANGAMA">AHANGAMA</option>
                <option value="AKURESSA">AKURESSA</option>
                <option value="AMBALANGODA">AMBALANGODA</option>
                <option value="AMBALANTOTA">AMBALANTOTA</option>
                {/* Add more groups as needed */}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className={`flex items-center justify-end p-4 mt-4 ${colors.sectionBg} ${colors.border} rounded-md`}
        >
      
          <div className="flex gap-2">
            <button
              type="submit"
              className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
            >
              OK
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
     
  );
};

ReportForm.propTypes = {
  onGenerateReport: PropTypes.func,
};

export default ReportForm;