/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AddPurchaseInvoiceForm = ({ onAddPurchaseInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    purchaseNo: "",
    supplierId: "",
    purchaseOrderRef: "",
    purchaseInvoiceId: "",
    invoiceStatus: "",
    invoiceDate: "",
    invoiceNo: "",
    paymentType: "",
    totalAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    lineItems: [{ product: "", quantity: "", price: "", focQty: 0 }],
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change for fields other than line items
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  // Handle changes for specific line items
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = invoiceData.lineItems.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setInvoiceData({ ...invoiceData, lineItems: updatedLineItems });
  };

  // Calculate the total and net amounts
  const calculateTotals = () => {
    const totalAmount = invoiceData.lineItems.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );

    const netAmount = totalAmount - invoiceData.discountAmount;
    setInvoiceData({ ...invoiceData, totalAmount, netAmount });
  };

  // Add a new empty line item
  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItems: [
        ...invoiceData.lineItems,
        { product: "", quantity: "", price: "", focQty: 0 },
      ],
    });
  };

  // Remove a line item
  const removeLineItem = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this line item?")) {
      const updatedLineItems = invoiceData.lineItems.filter(
        (_, index) => index !== indexToRemove
      );
      setInvoiceData({ ...invoiceData, lineItems: updatedLineItems });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !invoiceData.purchaseNo ||
      !invoiceData.supplierId ||
      !invoiceData.purchaseOrderRef
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Purchase Invoice added successfully!");

    if (onAddPurchaseInvoice) {
      onAddPurchaseInvoice(invoiceData);
    }

    setTimeout(() => {
      setInvoiceData({
        purchaseNo: "",
        supplierId: "",
        purchaseOrderRef: "",
        purchaseInvoiceId: "",
        invoiceStatus: "",
        invoiceDate: "",
        invoiceNo: "",
        paymentType: "",
        totalAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        lineItems: [{ product: "", quantity: "", price: "", focQty: 0 }],
      });
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
        Add Purchase Invoice
      </h2>

      {errorMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#991919]">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">
          {successMessage}
        </p>
      )}

      {/* Header Section (Top Fields in a Single Line) */}
      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Purchase Number:
            </label>
            <input
              type="number"
              name="purchaseNo"
              value={invoiceData.purchaseNo}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Supplier ID:
            </label>
            <select
              name="supplierId"
              value={invoiceData.supplierId}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            >
              <option value="">Choose a supplier</option>
              <option value="S001">S001</option>
              <option value="S002">S002</option>
            </select>
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Purchase Order Reference:
            </label>
            <input
              type="text"
              name="purchaseOrderRef"
              value={invoiceData.purchaseOrderRef}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Invoice Number:
            </label>
            <input
              type="number"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Purchase Invoice ID:
            </label>
            <input
              type="text"
              name="purchaseInvoiceId"
              value={invoiceData.purchaseInvoiceId}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>

          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Invoice Status:
            </label>
            <select
              id="invoiceStatus"
              name="invoiceStatus"
              value={invoiceData.invoiceStatus}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            >
              <option value="">Choose a status</option>
              <option value="PAID">Paid</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Invoice Date:
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">
              Payment Type:
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={invoiceData.paymentType}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            >
              <option value="">Choose a payment type</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="ONLINE TRANSACTION">Online Transaction</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-800">
            Notes:
          </label>
          <input
            type="text"
            name="notes"
            value=""
            readOnly
            className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-4">
        <table className="w-full border border-collapse border-gray-300">
          <thead className="bg-[#1a5353] text-white">
            <tr>
              <th className="p-2 text-left border border-gray-300">Product ID</th>
              <th className="p-2 text-left border border-gray-300">Name</th>
              <th className="p-2 text-left border border-gray-300">Quantity</th>
              <th className="p-2 text-left border border-gray-300">FOC Qty</th>
              <th className="p-2 text-left border border-gray-300">Cost Price</th>
              <th className="p-2 text-left border border-gray-300">Disc %</th>
              <th className="p-2 text-left border border-gray-300">Value</th>
              <th className="p-2 text-left border border-gray-300">Unit</th>
              <th className="p-2 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.map((item, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    placeholder="Product ID"
                    value={item.product}
                    onChange={(e) => handleLineItemChange(index, "product", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name || ""}
                    onChange={(e) => handleLineItemChange(index, "name", e.target.value)}
                    className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-red-500 rounded-md"
                    min="1"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    placeholder="FOC Qty"
                    value={item.focQty}
                    onChange={(e) => handleLineItemChange(index, "focQty", parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                    min="0"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    placeholder="Cost Price"
                    value={item.price}
                    onChange={(e) => handleLineItemChange(index, "price", parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-red-500 rounded-md"
                    min="0"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    placeholder="Disc %"
                    value={item.discount || 0}
                    onChange={(e) => handleLineItemChange(index, "discount", parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                    min="0"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>{((item.quantity * item.price) * (1 - (item.discount || 0) / 100)).toFixed(2)}</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    placeholder="Unit"
                    value={item.unit || ""}
                    onChange={(e) => handleLineItemChange(index, "unit", e.target.value)}
                    className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
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
            onClick={addLineItem}
            className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]"
          >
            + Add Line Item
          </button>
        </div>
      </div>

      {/* Footer Section (Totals, Discount, Adjustment, Net Total) */}
      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-800">Total:</label>
            <span className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md">
              {invoiceData.totalAmount.toFixed(2)}
            </span>
          </div>
          <div>
            <label className="text-sm text-gray-800">Discount %:</label>
            <input
              type="number"
              name="discountAmount"
              value={invoiceData.discountAmount}
              onChange={(e) => handleInputChange(e)}
              onBlur={calculateTotals}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm text-gray-800">Adjustment:</label>
            <input
              type="number"
              name="adjustment"
              value="0"
              readOnly
              className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm text-gray-800">Net Total:</label>
            <span className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md">
              {invoiceData.netAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons at Bottom */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
        >
          Add
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

AddPurchaseInvoiceForm.propTypes = {
  onAddPurchaseInvoice: PropTypes.func.isRequired,
};

export default AddPurchaseInvoiceForm;