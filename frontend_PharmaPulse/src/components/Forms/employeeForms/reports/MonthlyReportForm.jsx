/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Report Form Component
const ReportForm = ({ onPreview }) => {
  const [formData, setFormData] = useState({
    employee: "",
    fromDate: "",
    toDate: "",
    group: "",
    days: "",
    customers: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Dummy data for the report (same as before)
  const reportData = [
    {
      customer: "SUWASETHA PHARMACY - AHANGAMA",
      transactions: [
        { tranDate: "19-Jul-24", sysNo: "LEI2470", refNo: "LEI238", orderNo: "", description: "Sales Invoice - Credit", amount: 108211.62, paidAmount: 8211.62, balance: 100000.00, age: 163 },
        { tranDate: "19-Jul-24", sysNo: "LEI2528", refNo: "LEI243", orderNo: "", description: "Sales Invoice - Credit", amount: 2894.00, paidAmount: 0.00, balance: 2894.00, age: 150 },
        { tranDate: "19-Jul-24", sysNo: "LEI2608", refNo: "LEI251", orderNo: "", description: "Sales Invoice - Credit", amount: 81184.02, paidAmount: 0.00, balance: 81184.02, age: 133 },
        { tranDate: "01-Aug-24", sysNo: "LEI2647", refNo: "LEI255", orderNo: "", description: "Sales Invoice - Credit", amount: 21076.31, paidAmount: 0.00, balance: 21076.31, age: 133 },
        { tranDate: "17-Aug-24", sysNo: "LEI2727", refNo: "LEI263", orderNo: "", description: "Sales Invoice - Credit", amount: 8470.00, paidAmount: 0.00, balance: 8470.00, age: 120 },
        { tranDate: "17-Aug-24", sysNo: "LEI2728", refNo: "LEI263", orderNo: "", description: "Sales Invoice - Credit", amount: 251043.62, paidAmount: 0.00, balance: 251043.62, age: 104 },
        { tranDate: "17-Aug-24", sysNo: "LEI2728", refNo: "LEI263", orderNo: "", description: "Sales Invoice - Credit", amount: 121130.77, paidAmount: 0.00, balance: 121130.77, age: 104 },
        { tranDate: "17-Aug-24", sysNo: "LEI2729", refNo: "LEI263", orderNo: "", description: "Sales Invoice - Credit", amount: 79764.28, paidAmount: 0.00, balance: 79764.28, age: 104 },
      ],
      creditLimit: 0.00,
      creditPeriod: "0.00 Day",
      totalBalance: 665563.00,
    },
    {
      customer: "THISETH PHARMACY - AHANGAMA",
      transactions: [
        { tranDate: "02-Nov-24", sysNo: "LEI3024", refNo: "LEI293", orderNo: "", description: "Sales Invoice - Credit", amount: 71557.32, paidAmount: 0.00, balance: 71557.32, age: 27 },
        { tranDate: "02-Nov-24", sysNo: "LEI3025", refNo: "LEI293", orderNo: "", description: "Sales Invoice - Credit", amount: 4368.96, paidAmount: 0.00, balance: 4368.96, age: 26 },
        { tranDate: "21-Nov-24", sysNo: "LEI3100", refNo: "LEI304", orderNo: "", description: "Sales Invoice - Credit", amount: 17019.32, paidAmount: 0.00, balance: 17019.32, age: 8 },
      ],
      creditLimit: 0.00,
      creditPeriod: "0.00 Day",
      totalBalance: 92945.60,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    if (!formData.employee || !formData.fromDate || !formData.toDate) {
      setErrorMessage("Please fill out all required fields (Employee, From Date, To Date).");
      return;
    }

    setSuccessMessage("Preview generated successfully!");
    setErrorMessage("");

    // Filter data based on formData
    const filteredData = reportData.filter((item) => {
      const matchesGroup = formData.group ? item.customer.includes(formData.group) : true;
      const matchesDate = item.transactions.some((transaction) => {
        const tranDate = new Date(
          transaction.tranDate.split("-").reverse().join("-")
        ); // Convert DD-MMM-YY to YYYY-MM-DD
        const fromDate = new Date(formData.fromDate);
        const toDate = new Date(formData.toDate);
        return tranDate >= fromDate && tranDate <= toDate;
      });
      return matchesGroup && matchesDate;
    });

    if (onPreview) {
      onPreview({ formData, filteredData });
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handlePrint = () => {
    if (!formData.employee || !formData.fromDate || !formData.toDate) {
      setErrorMessage("Please fill out all required fields (Employee, From Date, To Date).");
      return;
    }

    // Filter data based on formData
    const filteredData = reportData.filter((item) => {
      const matchesGroup = formData.group ? item.customer.includes(formData.group) : true;
      const matchesDate = item.transactions.some((transaction) => {
        const tranDate = new Date(
          transaction.tranDate.split("-").reverse().join("-")
        ); // Convert DD-MMM-YY to YYYY-MM-DD
        const fromDate = new Date(formData.fromDate);
        const toDate = new Date(formData.toDate);
        return tranDate >= fromDate && tranDate <= toDate;
      });
      return matchesGroup && matchesDate;
    });

    // Generate PDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.text("A & K AGENCIES (PVT) LTD.", 14, 20);
    doc.setFontSize(10);
    doc.text("NO.52, HETTIWEEDIYA, OLD GALLE ROAD", 14, 28);
    doc.text("LG-0555 Pradeep", 14, 36);
    doc.setFontSize(12);
    doc.text(`Outstanding Report - ${formData.group || "All Groups"}`, 14, 44);
    doc.setFontSize(10);
    doc.text(`From: ${formData.fromDate} To: ${formData.toDate}`, 14, 52);
    doc.text(`Employee: ${formData.employee}`, 14, 60);

    let startY = 70;

    filteredData.forEach((customerData, index) => {
      // Customer Name
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(customerData.customer, 14, startY);
      doc.setFont("helvetica", "normal");
      startY += 10;

      // Table for transactions
      const tableColumn = [
        "TranDate",
        "Sys.No",
        "RefNo",
        "OrderNo",
        "Description",
        "Amount",
        "PaidAmount",
        "Balance",
        "Age (Days)",
      ];
      const tableRows = customerData.transactions.map((transaction) => [
        transaction.tranDate,
        transaction.sysNo,
        transaction.refNo,
        transaction.orderNo,
        transaction.description,
        transaction.amount.toFixed(2),
        transaction.paidAmount.toFixed(2),
        transaction.balance.toFixed(2),
        transaction.age,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 20 }, // TranDate
          1: { cellWidth: 20 }, // Sys.No
          2: { cellWidth: 20 }, // RefNo
          3: { cellWidth: 20 }, // OrderNo
          4: { cellWidth: 40 }, // Description
          5: { cellWidth: 20, halign: "right" }, // Amount
          6: { cellWidth: 20, halign: "right" }, // PaidAmount
          7: { cellWidth: 20, halign: "right" }, // Balance
          8: { cellWidth: 15, halign: "right" }, // Age (Days)
        },
      });

      startY = doc.lastAutoTable.finalY + 10;

      // Summary details
      doc.setFontSize(10);
      doc.text(`Credit Limit: ${customerData.creditLimit.toFixed(2)}`, 14, startY);
      startY += 5;
      doc.text(`Credit Period: ${customerData.creditPeriod}`, 14, startY);
      startY += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Total Balance: ${customerData.totalBalance.toFixed(2)}`, 14, startY);
      doc.setFont("helvetica", "normal");
      startY += 15;

      if (index < filteredData.length - 1) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save("Outstanding_Report.pdf");
  };

  const handleCancel = () => {
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
    <form
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md"
    >
      {/* Header */}
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
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
            <label className="block mb-1 text-sm text-gray-800">Employee: <span className="text-red-500">*</span></label>
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
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">Date Range: <span className="text-red-500">*</span></label>
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
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg}`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className={`p-4 ${colors.sectionBg} ${colors.border} rounded-md`}>
          <h3 className="mb-2 text-sm font-bold">SELECTED LOCATION LIST</h3>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-800">Location:</label>
            <select
              name="customers"
              value={formData.customers}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
            >
              <option value="">Select Sales Representative</option>
              <option value="LB-8062">LB-8062 Hasban</option>
              <option value="LG-7782">LG-7782 Santh OLD</option>
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
              name="customers"
              value={formData.customers}
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
              <option value="SUWASETHA PHARMACY">SUWASETHA PHARMACY</option>
              <option value="THISETH PHARMACY">THISETH PHARMACY</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-800">Customer Group:</label>
            <select
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              className={`w-full px-2 py-1 text-sm ${colors.inputBorder} rounded-md ${colors.dropdownBg} ${colors.dropdownText}`}
            >
              <option value="">Select Customer Group</option>
              <option value="AGALAWATTA">AGALAWATTA</option>
              <option value="AGULU KOPALASSA">AGULU KOPALASSA</option>
              <option value="AHANGAMA">AHANGAMA</option>
              <option value="AKURESSA">AKURESSA</option>
              <option value="AMBALANGODA">AMBALANGODA</option>
              <option value="AMBALANTOTA">AMBALANTOTA</option>
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
  onPreview: PropTypes.func,
};

// Report Table Component (for Preview)
const ReportTable = ({ previewData, onClose }) => {
  const { formData, filteredData } = previewData;

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
    <div className={`max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md`}>
      {/* Header */}
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
        A & K AGENCIES (PVT) LTD. - Outstanding Report
      </h2>
      <div className="mb-4 text-center">
        <p className="text-sm font-bold">
          {formData.group || "All Groups"} | From: {formData.fromDate} To: {formData.toDate} | Employee: {formData.employee}
        </p>
      </div>

      {/* Report Data */}
      {filteredData.length > 0 ? (
        filteredData.map((customerData, index) => (
          <div key={index} className="mb-6">
            {/* Customer Name */}
            <h3 className="mb-2 text-lg font-bold">{customerData.customer}</h3>

            {/* Transactions Table */}
            <table className="w-full mb-4 border border-collapse border-gray-300">
              <thead className={`${colors.headerBg} ${colors.textWhite}`}>
                <tr>
                  <th className="p-2 text-left border border-gray-300">TranDate</th>
                  <th className="p-2 text-left border border-gray-300">Sys.No</th>
                  <th className="p-2 text-left border border-gray-300">RefNo</th>
                  <th className="p-2 text-left border border-gray-300">OrderNo</th>
                  <th className="p-2 text-left border border-gray-300">Description</th>
                  <th className="p-2 text-right border border-gray-300">Amount</th>
                  <th className="p-2 text-right border border-gray-300">PaidAmount</th>
                  <th className="p-2 text-right border border-gray-300">Balance</th>
                  <th className="p-2 text-right border border-gray-300">Age (Days)</th>
                </tr>
              </thead>
              <tbody>
                {customerData.transactions.map((transaction, idx) => (
                  <tr key={idx} className="border border-gray-300">
                    <td className="p-2 border border-gray-300">{transaction.tranDate}</td>
                    <td className="p-2 border border-gray-300">{transaction.sysNo}</td>
                    <td className="p-2 border border-gray-300">{transaction.refNo}</td>
                    <td className="p-2 border border-gray-300">{transaction.orderNo}</td>
                    <td className="p-2 border border-gray-300">{transaction.description}</td>
                    <td className="p-2 text-right border border-gray-300">{transaction.amount.toFixed(2)}</td>
                    <td className="p-2 text-right border border-gray-300">{transaction.paidAmount.toFixed(2)}</td>
                    <td className="p-2 text-right border border-gray-300">{transaction.balance.toFixed(2)}</td>
                    <td className="p-2 text-right border border-gray-300">{transaction.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Details */}
            <div className="text-sm">
              <p>Credit Limit: {customerData.creditLimit.toFixed(2)}</p>
              <p>Credit Period: {customerData.creditPeriod}</p>
              <p className="font-bold">Total Balance: {customerData.totalBalance.toFixed(2)}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No data available for the selected filters.</p>
      )}

      {/* Footer Section */}
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

ReportTable.propTypes = {
  previewData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Parent Component to Manage State and Navigation Between Form and Table
const OutstandingReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handlePreview = (data) => {
    setPreviewData(data);
    setShowTable(true);
  };

  const handleCloseTable = () => {
    setShowTable(false);
    setPreviewData(null);
  };

  return (
    <>
      {showTable ? (
        <ReportTable previewData={previewData} onClose={handleCloseTable} />
      ) : (
        <ReportForm onPreview={handlePreview} />
      )}
    </>
  );
};

export default OutstandingReport;