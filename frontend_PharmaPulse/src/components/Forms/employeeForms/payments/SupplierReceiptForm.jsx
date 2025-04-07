/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SupplierReceiptForm = ({ onAddReceipt }) => {
  const [formData, setFormData] = useState({
    receiptNo: "",
    receiptDate: "",
    supplierId: "",
    contact: "",
    outstanding: "",
    creditLimit: "",
    creditPeriod: "",
    receiptMethod: "CHEQUE",
    remarks: "",
    bankAccount: "",
    chequeNo: "",
    validDate: "",
    fullySetOff: "",
    partlySetOff: "",
    totalSelected: "0", // Initialize as "0"
  });

  const [tableData, setTableData] = useState([
    { date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" },
  ]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "setOffType") {
        return {
          ...prevData,
          fullySetOff: value === "fully" ? "1" : "0",
          partlySetOff: value === "partly" ? "1" : "0",
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleTableChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;

    // Calculate balance when amount or paid changes
    if (field === "amount" || field === "paid") {
      const amount = parseFloat(updatedTableData[index].amount) || 0;
      const paid = parseFloat(updatedTableData[index].paid) || 0;
      updatedTableData[index].balance = (amount - paid).toFixed(2);
    }

    setTableData(updatedTableData);

    // Calculate totalSelected as sum of all balances
    const total = updatedTableData.reduce((sum, row) => {
      return sum + (parseFloat(row.balance) || 0);
    }, 0).toFixed(2);

    setFormData((prevData) => ({
      ...prevData,
      totalSelected: total,
    }));
  };

  const addTableRow = () => {
    const updatedTableData = [...tableData, { date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" }];
    setTableData(updatedTableData);

    // Recalculate totalSelected after adding a row
    const total = updatedTableData.reduce((sum, row) => {
      return sum + (parseFloat(row.balance) || 0);
    }, 0).toFixed(2);

    setFormData((prevData) => ({
      ...prevData,
      totalSelected: total,
    }));
  };

  const removeTableRow = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this row?")) {
      const updatedTableData = tableData.filter((_, index) => index !== indexToRemove);
      setTableData(updatedTableData);

      // Recalculate totalSelected after removing a row
      const total = updatedTableData.reduce((sum, row) => {
        return sum + (parseFloat(row.balance) || 0);
      }, 0).toFixed(2);

      setFormData((prevData) => ({
        ...prevData,
        totalSelected: total,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.receiptNo ||
      !formData.receiptDate ||
      !formData.receiptMethod ||
      !formData.bankAccount
    ) {
      setErrorMessage("Please fill out all required fields (Receipt No, Receipt Date, Receipt Method, Bank Account).");
      return;
    }

    // Simulate a successful submission
    const newReceipt = {
      ...formData,
      transactions: tableData,
    };

    setSuccessMessage("Receipt added successfully!");
    setShowPopup(true); // Show the popup on success
    
    if (onAddReceipt) {
      onAddReceipt(newReceipt);
    }
  };

  const handlePopupContinue = () => {
    setShowPopup(false);
    setFormData({
      receiptNo: "",
      receiptDate: "",
      supplierId: "",
      contact: "",
      outstanding: "",
      creditLimit: "",
      creditPeriod: "",
      receiptMethod: "CHEQUE",
      remarks: "",
      bankAccount: "",
      chequeNo: "",
      validDate: "",
      fullySetOff: "0",
      partlySetOff: "0",
      totalSelected: "0",
    });
    setTableData([{ date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" }]);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-md shadow-md"
      >
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
          Supplier Receipt
        </h2>
        <p className="mb-4 text-sm text-right text-gray-600">Fields marked with <span className="text-red-500">*</span> are required</p>

        {errorMessage && (
          <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
        )}
        {successMessage && !showPopup && (
          <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
        )}

        {/* Header Section */}
        <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Receipt No: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Receipt Date: <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="receiptDate"
                  value={formData.receiptDate}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Supplier Id:</label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                >
                  <option value="">Select a Supplier</option>
                  <option value="1001">Supplier 1001 - ABC Corp</option>
                  <option value="1002">Supplier 1002 - XYZ Ltd</option>
                  <option value="1003">Supplier 1003 - QRS Inc</option>
                  <option value="1004">Supplier 1004 - DEF Supplies</option>
                  <option value="1005">Supplier 1005 - GHI Enterprises</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Contact:</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Receipt Method: <span className="text-red-500">*</span></label>
                <select
                  name="receiptMethod"
                  value={formData.receiptMethod}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
                >
                  <option value="">Select a method</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="CASH">CASH</option>
                  <option value="CREDIT/DEBIT CARD">CREDIT/DEBIT CARD</option>
                  <option value="ONLINE TRANSACTION">ONLINE TRANSACTION</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Outstanding:</label>
                <input
                  type="text"
                  name="outstanding"
                  value={formData.outstanding}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Credit Limit:</label>
                <input
                  type="text"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Credit Period:</label>
                <input
                  type="text"
                  name="creditPeriod"
                  value={formData.creditPeriod}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Bank Account: <span className="text-red-500">*</span></label>
                <select
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
                >
                 <option value="">Select Bank Account</option>
                      <option>BOC - 8864579852</option>
                      <option>People Bank - 255 2004 456 789</option>
                     
                  </select>
              </div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Cheque No:</label>
                <input
                  type="text"
                  name="chequeNo"
                  value={formData.chequeNo}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Valid Date:</label>
                <input
                  type="date"
                  name="validDate"
                  value={formData.validDate}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
            
            </div>
            <div>
              <div className="mb-4">
                <label className="w-full text-sm text-gray-800">Remarks:</label>
                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
                  placeholder="Enter any additional remarks"
                />
              </div>
             
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-4">
          <table className="w-full border border-collapse border-gray-300">
            <thead className="bg-[#1a5353] text-white">
              <tr>
                <th className="p-2 text-left border border-gray-300">Date</th>
                <th className="p-2 text-left border border-gray-300">Document Ref</th>
                <th className="p-2 text-left border border-gray-300">Description</th>
                <th className="p-2 text-left border border-gray-300">Amount</th>
                <th className="p-2 text-left border border-gray-300">Paid</th>
                <th className="p-2 text-left border border-gray-300">Balance</th>
                <th className="p-2 text-left border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleTableChange(index, "date", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Document Ref"
                      value={row.docRef}
                      onChange={(e) => handleTableChange(index, "docRef", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Description"
                      value={row.description}
                      onChange={(e) => handleTableChange(index, "description", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) => handleTableChange(index, "amount", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      min="0"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      placeholder="Paid"
                      value={row.paid}
                      onChange={(e) => handleTableChange(index, "paid", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      min="0"
                    />
                  </td>
                  <td className="p-2 border border-gray-300 rounded-md borderexplorepagebreak">
                    <input
                      type="number"
                      placeholder="Balance"
                      value={row.balance}
                      disabled
                      className="w-full px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      type="button"
                      onClick={() => removeTableRow(index)}
                      className="bg-[#4c85a6] text-white py-1 px-2 rounded-md text-sm hover:bg-[#15375c]"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={addTableRow}
              className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]"
            >
              + Add Row
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-800">Set Off Type:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center text-sm text-gray-800">
                  <input
                    type="radio"
                    name="setOffType"
                    value="fully"
                    checked={formData.fullySetOff === "1"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Fully Set Off
                </label>
                <label className="flex items-center text-sm text-gray-800">
                  <input
                    type="radio"
                    name="setOffType"
                    value="partly"
                    checked={formData.partlySetOff === "1"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Partly Set Off
                </label>
              </div>
            </div>
            <div></div> {/* Empty div for layout */}
            <div>
              <label className="text-sm text-gray-800">Total Selected:</label>
              <input
                type="text"
                name="totalSelected"
                value={formData.totalSelected}
                disabled
                className="w-full px-2 py-1 mt-1 text-sm bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          >
            Save
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

      {/* Success Popup Modal with Purple Theme */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Purple Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-purple-600 rounded-full">
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
              Supplier receipt added successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-purple-600 rounded-md hover:bg-purple-700"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

SupplierReceiptForm.propTypes = {
  onAddReceipt: PropTypes.func,
};

export default SupplierReceiptForm;