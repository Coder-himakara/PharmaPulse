/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Stock Balance Report Form Component
const StockBalanceReportForm = ({ onPreview }) => {
  const [formData, setFormData] = useState({
    location: "",
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
    if (!formData.location) {
      setErrorMessage("Please select a location.");
      return;
    }

    setSuccessMessage("Preview generated successfully!");
    setErrorMessage("");

    if (onPreview) {
      onPreview(formData);
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handlePrint = () => {
    console.log("Print button clicked", formData);

    if (!formData.location) {
      setErrorMessage("Please select a location before printing.");
      return;
    }

    // Expanded dummy data for PDF generation
    const fullTableData = [
      {
        pid: "001-005",
        description: "ZYNCET SYRUP",
        wPrice: 346.8,
        unit: "60ML",
        qty: 190,
        pQty: "",
        remarks: "",
        location: "Main Store",
        purchaseGroup: "Pharmaceuticals",
        genericName: "Cetirizine",
      },
      {
        pid: "005-026",
        description: "BECOULES CAPSULES",
        wPrice: 6410.25,
        unit: "300'S",
        qty: 2,
        pQty: "",
        remarks: "Batch #1234",
        location: "Truck 1",
        purchaseGroup: "Medical Supplies",
        genericName: "Amoxicillin",
      },
      {
        pid: "005-005",
        description: "PYRENTIN - 125 TABLETS",
        wPrice: 1387.5,
        unit: "100'S",
        qty: 10,
        pQty: "",
        remarks: "",
        location: "Main Store",
        purchaseGroup: "Pharmaceuticals",
        genericName: "Paracetamol",
      },
      {
        pid: "002-015",
        description: "IBUFEN SUSPENSION",
        wPrice: 275.0,
        unit: "100ML",
        qty: 50,
        pQty: "",
        remarks: "Expires 12/2025",
        location: "Truck 2",
        purchaseGroup: "Pharmaceuticals",
        genericName: "Ibuprofen",
      },
      {
        pid: "007-003",
        description: "GLUCOCHECK METER",
        wPrice: 4500.0,
        unit: "1UNIT",
        qty: 8,
        pQty: "",
        remarks: "",
        location: "Main Store",
        purchaseGroup: "Equipment",
        genericName: "Glucometer",
      },
      {
        pid: "003-009",
        description: "AMOXIL SYRUP",
        wPrice: 520.75,
        unit: "90ML",
        qty: 120,
        pQty: "",
        remarks: "",
        location: "Truck 3",
        purchaseGroup: "Pharmaceuticals",
        genericName: "Amoxicillin",
      },
      {
        pid: "008-022",
        description: "STERILE GAUZE",
        wPrice: 150.0,
        unit: "10'S",
        qty: 200,
        pQty: "",
        remarks: "Sterilized",
        location: "Main Store",
        purchaseGroup: "Consumables",
        genericName: "Gauze",
      },
      {
        pid: "004-017",
        description: "CETRIZ TABLETS",
        wPrice: 980.3,
        unit: "50'S",
        qty: 25,
        pQty: "",
        remarks: "",
        location: "Truck 1",
        purchaseGroup: "Pharmaceuticals",
        genericName: "Cetirizine",
      },
      {
        pid: "006-011",
        description: "SYRINGE 5ML",
        wPrice: 25.5,
        unit: "100'S",
        qty: 300,
        pQty: "",
        remarks: "",
        location: "Truck 2",
        purchaseGroup: "Consumables",
        genericName: "Syringe",
      },
      {
        pid: "009-030",
        description: "THERMOMETER DIGITAL",
        wPrice: 320.0,
        unit: "1UNIT",
        qty: 15,
        pQty: "",
        remarks: "Battery Included",
        location: "Main Store",
        purchaseGroup: "Equipment",
        genericName: "Thermometer",
      },
    ];

    // Filter data based on formData
    const filteredData = fullTableData.filter((item) => {
      const matchesLocation = formData.location ? item.location === formData.location : true;
      const matchesGroup = formData.searchByGroup ? item.purchaseGroup === formData.searchByGroup : true;
      const matchesGeneric = formData.searchByGeneric ? item.genericName === formData.searchByGeneric : true;
      return matchesLocation && matchesGroup && matchesGeneric;
    });

    console.log("Filtered Data for PDF:", filteredData);

    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("A & K AGENCIES (PVT) LTD. - Stock Balance Report", 10, 10);
    doc.setFontSize(12);
    doc.text(
      `${formData.location}${formData.searchByGroup ? ` | ${formData.searchByGroup}` : ""}${
        formData.searchByGeneric ? ` | ${formData.searchByGeneric}` : ""
      }`,
      10,
      20
    );

    const tableColumn = ["P.ID", "Description", "W.Price", "Unit", "Qty", "P.Qty", "Remarks"];
    const tableRows = filteredData.map((item) => [
      item.pid,
      item.description,
      item.wPrice.toFixed(2),
      item.unit,
      item.qty,
      item.pQty,
      item.remarks,
    ]);

    if (filteredData.length === 0) {
      doc.text("No data available for the selected filters.", 10, 30);
    } else {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "grid",
        styles: { fontSize: 10 },
      });
    }

    doc.save("Stock_Balance_Report.pdf");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const colors = {
    background: "bg-[#e6eef3]",
    headerBg: "bg-[#1a5353]",
    textWhite: "text-white",
    inputBorder: "border-black",
    buttonBg: "bg-[#4c85a6]",
    buttonHover: "hover:bg-[#15375c]",
    dropdownBg: "bg-white",
    dropdownText: "text-black",
    sectionBg: "bg-white",
    border: "border-gray-300",
  };

  return (
    <form className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
        Stock Balance Report
      </h2>

      {errorMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
      )}

      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <h3 className="mb-2 text-sm font-bold text-center">MONTHLY STOCK REPORT</h3>
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">
            A Selected Location: <span className="text-red-500">*</span>
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
          >
            <option value="">Select Location</option>
            <option value="Main Store">Main Store</option>
            <option value="Truck 1">Truck 1</option>
            <option value="Truck 2">Truck 2</option>
            <option value="Truck 3">Truck 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Search By Purchase Group:</label>
          <select
            name="searchByGroup"
            value={formData.searchByGroup}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
          >
            <option value="">Select Purchase Group</option>
            <option value="Pharmaceuticals">Pharmaceuticals</option>
            <option value="Medical Supplies">Medical Supplies</option>
            <option value="Equipment">Equipment</option>
            <option value="Consumables">Consumables</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Search By Generic Name:</label>
          <select
            name="searchByGeneric"
            value={formData.searchByGeneric}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
          >
            <option value="">Select Generic Name</option>
            <option value="Paracetamol">Paracetamol</option>
            <option value="Ibuprofen">Ibuprofen</option>
            <option value="Amoxicillin">Amoxicillin</option>
            <option value="Cetirizine">Cetirizine</option>
            <option value="Glucometer">Glucometer</option>
            <option value="Gauze">Gauze</option>
            <option value="Syringe">Syringe</option>
            <option value="Thermometer">Thermometer</option>
          </select>
        </div>
      </div>

      <div
        className={`flex items-center justify-end p-4 mt-4 ${colors.sectionBg} ${colors.border} rounded-md`}
      >
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
            onClick={handlePrint}
            className={`${colors.buttonBg} ${colors.textWhite} px-5 py-2 border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${colors.buttonHover}`}
          >
            Print
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
  const fullTableData = [
    {
      pid: "001-005",
      description: "ZYNCET SYRUP",
      wPrice: 346.8,
      unit: "60ML",
      qty: 190,
      pQty: "",
      remarks: "",
      location: "Main Store",
      purchaseGroup: "Pharmaceuticals",
      genericName: "Cetirizine",
    },
    {
      pid: "005-026",
      description: "BECOULES CAPSULES",
      wPrice: 6410.25,
      unit: "300'S",
      qty: 2,
      pQty: "",
      remarks: "Batch #1234",
      location: "Truck 1",
      purchaseGroup: "Medical Supplies",
      genericName: "Amoxicillin",
    },
    {
      pid: "005-005",
      description: "PYRENTIN - 125 TABLETS",
      wPrice: 1387.5,
      unit: "100'S",
      qty: 10,
      pQty: "",
      remarks: "",
      location: "Main Store",
      purchaseGroup: "Pharmaceuticals",
      genericName: "Paracetamol",
    },
    {
      pid: "002-015",
      description: "IBUFEN SUSPENSION",
      wPrice: 275.0,
      unit: "100ML",
      qty: 50,
      pQty: "",
      remarks: "Expires 12/2025",
      location: "Truck 2",
      purchaseGroup: "Pharmaceuticals",
      genericName: "Ibuprofen",
    },
    {
      pid: "007-003",
      description: "GLUCOCHECK METER",
      wPrice: 4500.0,
      unit: "1UNIT",
      qty: 8,
      pQty: "",
      remarks: "",
      location: "Main Store",
      purchaseGroup: "Equipment",
      genericName: "Glucometer",
    },
    {
      pid: "003-009",
      description: "AMOXIL SYRUP",
      wPrice: 520.75,
      unit: "90ML",
      qty: 120,
      pQty: "",
      remarks: "",
      location: "Truck 3",
      purchaseGroup: "Pharmaceuticals",
      genericName: "Amoxicillin",
    },
    {
      pid: "008-022",
      description: "STERILE GAUZE",
      wPrice: 150.0,
      unit: "10'S",
      qty: 200,
      pQty: "",
      remarks: "Sterilized",
      location: "Main Store",
      purchaseGroup: "Consumables",
      genericName: "Gauze",
    },
    {
      pid: "004-017",
      description: "CETRIZ TABLETS",
      wPrice: 980.3,
      unit: "50'S",
      qty: 25,
      pQty: "",
      remarks: "",
      location: "Truck 1",
      purchaseGroup: "Pharmaceuticals",
      genericName: "Cetirizine",
    },
    {
      pid: "006-011",
      description: "SYRINGE 5ML",
      wPrice: 25.5,
      unit: "100'S",
      qty: 300,
      pQty: "",
      remarks: "",
      location: "Truck 2",
      purchaseGroup: "Consumables",
      genericName: "Syringe",
    },
    {
      pid: "009-030",
      description: "THERMOMETER DIGITAL",
      wPrice: 320.0,
      unit: "1UNIT",
      qty: 15,
      pQty: "",
      remarks: "Battery Included",
      location: "Main Store",
      purchaseGroup: "Equipment",
      genericName: "Thermometer",
    },
  ];

  const tableData = fullTableData.filter((item) => {
    const matchesLocation = formData.location ? item.location === formData.location : true;
    const matchesGroup = formData.searchByGroup ? item.purchaseGroup === formData.searchByGroup : true;
    const matchesGeneric = formData.searchByGeneric ? item.genericName === formData.searchByGeneric : true;
    return matchesLocation && matchesGroup && matchesGeneric;
  });

  const colors = {
    background: "bg-[#e6eef3]",
    headerBg: "bg-[#1a5353]",
    textWhite: "text-white",
    inputBorder: "border-black",
    buttonBg: "bg-[#4c85a6]",
    buttonHover: "hover:bg-[#15375c]",
    dropdownBg: "bg-white",
    dropdownText: "text-black",
    sectionBg: "bg-white",
    border: "border-gray-300",
  };

  return (
    <div className={`max-w-4xl mx-auto p-5 bg-[#e6eef3] text-center border border-gray-300 rounded-lg shadow-md`}>
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
        A & K AGENCIES (PVT) LTD. - Stock Balance Report
      </h2>
      <div className="mb-4 text-center">
        <p className="text-sm font-bold text-center">
          {formData.location} {formData.searchByGroup && `| ${formData.searchByGroup}`}
          {formData.searchByGeneric && `| ${formData.searchByGeneric}`}
        </p>
      </div>
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
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">{row.pid}</td>
                  <td className="p-2 border border-gray-300">{row.description}</td>
                  <td className="p-2 border border-gray-300">{row.wPrice.toFixed(2)}</td>
                  <td className="p-2 border border-gray-300">{row.unit}</td>
                  <td className="p-2 border border-gray-300">{row.qty}</td>
                  <td className="p-2 border border-gray-300">{row.pQty}</td>
                  <td className="p-2 border border-gray-300">{row.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-2 text-center text-gray-600">
                  No stock data available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        className={`flex items-center justify-end p-4 ${colors.sectionBg} ${colors.border} rounded-md`}
      >
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