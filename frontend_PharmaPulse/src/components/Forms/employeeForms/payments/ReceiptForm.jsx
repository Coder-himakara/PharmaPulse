/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReceiptForm = ({ onAddReceipt }) => {
  const [formData, setFormData] = useState({
    receiptNo: "1282",
    receiptDate: "12-DEC-24",
    customer: "",
    contact: "",
    outstanding: "",
    creditLimit: "",
    creditPeriod: "",
    receiptMethod: "CHEQUE",
    remarks: "",
    bankAccount: "",
    chequeNo: "",
    validDate: "12-DEC-24",
    branch: "",
    amount: "0",
    fullySetOff: "0",
    partlySetOff: "0",
    totalSelected: "0",
  });

  const [tableData, setTableData] = useState([
    { date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" },
  ]);

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

  const handleTableChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    setTableData(updatedTableData);
  };

  const addTableRow = () => {
    setTableData([...tableData, { date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" }]);
  };

  const removeTableRow = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this row?")) {
      const updatedTableData = tableData.filter((_, index) => index !== indexToRemove);
      setTableData(updatedTableData);
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
    if (onAddReceipt) {
      onAddReceipt(newReceipt);
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        receiptNo: "",
        receiptDate: "",
        customer: "",
        contact: "",
        outstanding: "",
        creditLimit: "",
        creditPeriod: "",
        receiptMethod: "",
        remarks: "",
        bankAccount: "",
        chequeNo: "",
        validDate: "",
        branch: "",
        amount: "0",
        fullySetOff: "0",
        partlySetOff: "0",
        totalSelected: "0",
      });
      setTableData([{ date: "", docRef: "", description: "", amount: "", paid: "", balance: "", age: "" }]);
      setSuccessMessage("");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg">
        Receipt Entry
      </h2>

      {errorMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
      )}

      {/* Header Section */}
      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <label className="w-full text-sm text-gray-800">Receipt No:</label>
              <input
                type="text"
                name="receiptNo"
                value={formData.receiptNo}
                onChange={handleInputChange}
                className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="w-full text-sm text-gray-800">Receipt Date:</label>
              <input
                type="date"
                name="receiptDate"
                value={formData.receiptDate}
                onChange={handleInputChange}
                className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="w-full text-sm text-gray-800">Customer:</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className="w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md"
              />
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
              <label className="w-full text-sm text-gray-800">Receipt Method:</label>
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
                <option value="DIRECT DEPOSIT">DIRECT DEPOSIT</option>
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
              <label className="w-full text-sm text-gray-800">Bank Account:</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleInputChange}
                className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
              />
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
            <div className="mb-4">
              <label className="w-full text-sm text-gray-800">Branch:</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
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
            <div className="mb-4">
              <label className="w-full text-sm text-gray-800">Amount:</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                disabled
                className="w-full px-2 py-1 mt-1 text-sm bg-gray-100 border border-gray-300 rounded-md"
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
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    placeholder="Balance"
                    value={row.balance}
                    onChange={(e) => handleTableChange(index, "balance", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    min="0"
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
            <label className="text-sm text-gray-800">Fully Set Off:</label>
            <input
              type="text"
              name="fullySetOff"
              value={formData.fullySetOff}
              disabled
              className="w-full px-2 py-1 mt-1 text-sm bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm text-gray-800">Partly Set Off:</label>
            <input
              type="text"
              name="partlySetOff"
              value={formData.partlySetOff}
              disabled
              className="w-full px-2 py-1 mt-1 text-sm bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
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
  );
};

ReceiptForm.propTypes = {
  onAddReceipt: PropTypes.func.isRequired,
};

export default ReceiptForm;