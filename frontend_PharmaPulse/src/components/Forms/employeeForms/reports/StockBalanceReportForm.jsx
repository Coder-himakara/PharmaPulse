/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Stock Balance Report Form Component
const StockBalanceReportForm = ({ onPreview }) => {
  const [formData, setFormData] = useState({
    location: "Main Store",
    groupLevel1: "",
    groupLevel2: "",
    groupLevel3: "",
    searchByGroup: "",
    searchByGeneric: "",
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

  const handlePreview = () => {
    // Validation
    if (!formData.location) {
      setErrorMessage("Please select a location.");
      return;
    }

    // Simulate a successful preview action
    setSuccessMessage("Preview generated successfully!");
    setErrorMessage("");

    // Call the onPreview callback to show the table
    if (onPreview) {
      onPreview(formData);
    }

    // Clear success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  // Color scheme from the image
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
      
      <form className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md">
        {/* Header */}
        <h2
          className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
          Stock Balance Report
        </h2>

        {errorMessage && (
          <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
        )}

        {/* Main Content */}
        <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
          <h3 className="mb-2 text-sm font-bold">REPORT</h3>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">A Selected Location:</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
            >
              <option value="">Select Location</option>
              <option value="Main Store">Main Store</option>
              <option value="Location Main Store">Location Main Store</option>
              {/* Add more locations as needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">Group Level:</label>
            <div className="flex gap-2">
              <select
                name="groupLevel1"
                value={formData.groupLevel1}
                onChange={handleInputChange}
                className={`w-1/3 px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Level 1</option>
                <option value="NA">NA</option>
                {/* Add more group levels as needed */}
              </select>
              <select
                name="groupLevel2"
                value={formData.groupLevel2}
                onChange={handleInputChange}
                className={`w-1/3 px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Level 2</option>
                <option value="Unknown">Unknown</option>
                {/* Add more group levels as needed */}
              </select>
              <select
                name="groupLevel3"
                value={formData.groupLevel3}
                onChange={handleInputChange}
                className={`w-1/3 px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
              >
                <option value="">Level 3</option>
                <option value="Unknown">Unknown</option>
                {/* Add more group levels as needed */}
              </select>
            </div>
          </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">Search By Group:</label>
            <input
              type="text"
              name="searchByGroup"
              value={formData.searchByGroup}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">Search By Generic Name:</label>
            <input
              type="text"
              name="searchByGeneric"
              value={formData.searchByGeneric}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
            />
          </div>
      

        {/* Footer Section */}
        <div
          className={`flex items-center justify-between p-4 mt-4 ${colors.sectionBg} ${colors.border} rounded-md`}
        >
          <div className="text-sm">
            <p>LG-7782 Santh</p>
            <p>Change Password</p>
            <p>12-DEC-24, CAPS, NUM</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleClose}
              className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
            >
              Close
            </button>
          </div>
        </div>
      </form>
 
  );
};

StockBalanceReportForm.propTypes = {
  onPreview: PropTypes.func,
};

// Stock Balance Report Table Component
const StockBalanceReportTable = ({ formData, onClose }) => {
  // Sample data to display in the table (you can replace this with actual data from an API)
  const tableData = [
    { pid: "001-005", description: "ZYNCET SYRUP", wPrice: 346.80, unit: "60ML", qty: 190, pQty: "", remarks: "" },
    { pid: "005-026", description: "BECOULES CAPSULES", wPrice: "6,410.25", unit: "300'S", qty: 2, pQty: "", remarks: "" },
    { pid: "005-005", description: "PYRENTIN - 125 TABLETS", wPrice: "1,387.50", unit: "100'S", qty: 10, pQty: "", remarks: "" },
    { pid: "005-027", description: "PYRENTIN SUSPENSION", wPrice: 226.45, unit: "10ML", qty: 11, pQty: "", remarks: "" },
    { pid: "005-004", description: "BURHANI ENTERPRISES", wPrice: 230.80, unit: "10ML", qty: 13, pQty: "", remarks: "" },
    { pid: "006-001", description: "CEYOKA (PVT) LTD", wPrice: "2,289.30", unit: "30", qty: 30, pQty: "", remarks: "" },
    { pid: "007-024", description: "ADIFLAM - 50 (BLISTER) TABLETS", wPrice: 867.20, unit: "100'S", qty: 70, pQty: "", remarks: "" },
    { pid: "007-031", description: "AL-CLOX 500", wPrice: "1,284.50", unit: "500'S", qty: 40, pQty: "", remarks: "" },
  ];

  // Color scheme from the image
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
    <div className={`max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md`}>
      
        {/* Header */}
        <h2
          className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
          A & K AGENCIES (PVT) LTD. - Stock Balance Report
        </h2>

        {/* Subheader */}
        <div className="mb-4 text-center">
          <p className="text-sm font-bold">{formData.location}</p>
        </div>

        {/* Table */}
        <div className="mb-4">
          <table className="w-full border border-collapse border-gray-300">
            <thead className={`${colors.headerBg} ${colors.textWhite}`}>
              <tr>
                <th className="p-2 text-left border border-gray-300">P.ID</th>
                <th className="p-2 text-left border border-gray-300">DESCRIPTION</th>
                <th className="p-2 text-left border border-gray-300">W.PRICE</th>
                <th className="p-2 text-left border border-gray-300">UNIT</th>
                <th className="p-2 text-left border border-gray-300">QTY</th>
                <th className="p-2 text-left border border-gray-300">P.QTY</th>
                <th className="p-2 text-left border border-gray-300">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">{row.pid}</td>
                  <td className="p-2 border border-gray-300">{row.description}</td>
                  <td className="p-2 border border-gray-300">{row.wPrice}</td>
                  <td className="p-2 border border-gray-300">{row.unit}</td>
                  <td className="p-2 border border-gray-300">{row.qty}</td>
                  <td className="p-2 border border-gray-300">{row.pQty}</td>
                  <td className="p-2 border border-gray-300">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div
          className={`flex items-center justify-between p-4 ${colors.sectionBg} ${colors.border} rounded-md`}
        >
          <div className="text-sm">
            <p>LG-7782 Santh</p>
            <p>Change Password</p>
            <p>12-DEC-24, CAPS, NUM</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    
  );
};

StockBalanceReportTable.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Parent Component to Manage State and Navigation Between Form and Table
const StockBalanceReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handlePreview = (formData) => {
    setPreviewData(formData);
    setShowTable(true);
  };

  const handleCloseTable = () => {
    setShowTable(false);
    setPreviewData(null);
  };

  return (
    <>
      {showTable ? (
        <StockBalanceReportTable formData={previewData} onClose={handleCloseTable} />
      ) : (
        <StockBalanceReportForm onPreview={handlePreview} />
      )}
    </>
  );
};

export default StockBalanceReport;