/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8090/api/purchase-invoices";
const SUPPLIERS_API_URL = "http://localhost:8090/api/suppliers/all";

const AddPurchaseInvoiceForm = ({ onAddPurchaseInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    supplierId: "",
    purchaseOrderRef: "",
    lineItemsList: [{ product: "", quantity: "", price: "", focQty: 0, discount: 0 }],
    invoiceNo: "",
    invoiceDate: "",
    invoiceStatus: "",
    paymentType: "",
    totalAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    notes: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        console.log("Fetching suppliers from:", SUPPLIERS_API_URL);
        const response = await axios.get(SUPPLIERS_API_URL, {
          headers: { "Content-Type": "application/json" },
          auth: { username: "admin", password: "admin123" },
        });
        console.log("Suppliers Response:", JSON.stringify(response.data, null, 2));
        const data = response.data.data || response.data || [];
        setSuppliers(Array.isArray(data) ? data : []);
        setLoadingSuppliers(false);
      } catch (error) {
        console.error("Error fetching suppliers:", error.response || error);
        setErrorMessage("Failed to fetch suppliers: " + (error.response?.data?.message || error.message));
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = invoiceData.lineItemsList.map((item, idx) =>
      idx === index
        ? {
            ...item,
            [field]: field === "quantity" || field === "focQty" ? parseInt(value) || 0 : parseFloat(value) || 0,
          }
        : item
    );
    setInvoiceData({ ...invoiceData, lineItemsList: updatedLineItems });
  };

  const calculateTotals = () => {
    const totalAmount = invoiceData.lineItemsList.reduce(
      (sum, item) => sum + (item.quantity * item.price * (1 - (item.discount || 0) / 100) || 0),
      0
    );
    const netAmount = totalAmount - (parseFloat(invoiceData.discountAmount) || 0);
    return { totalAmount, netAmount };
  };

  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItemsList: [
        ...invoiceData.lineItemsList,
        { product: "", quantity: "", price: "", focQty: 0, discount: 0 },
      ],
    });
  };

  const removeLineItem = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this line item?")) {
      const updatedLineItems = invoiceData.lineItemsList.filter((_, index) => index !== indexToRemove);
      setInvoiceData({ ...invoiceData, lineItemsList: updatedLineItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceData.supplierId || !invoiceData.purchaseOrderRef) {
      setErrorMessage("Please fill out all required fields (Supplier ID and Purchase Order Reference).");
      return;
    }

    const { totalAmount, netAmount } = calculateTotals();

    const payload = {
      supplierId: invoiceData.supplierId,
      purchaseOrderRef: invoiceData.purchaseOrderRef,
      lineItemsList: invoiceData.lineItemsList.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        focQty: item.focQty,
        discount: item.discount,
      })),
      invoiceNo: invoiceData.invoiceNo,
      invoiceDate: invoiceData.invoiceDate,
      invoiceStatus: invoiceData.invoiceStatus,
      paymentType: invoiceData.paymentType,
      totalAmount,
      discountAmount: parseFloat(invoiceData.discountAmount) || 0,
      netAmount,
      notes: invoiceData.notes,
    };

    try {
      console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
      const response = await axios.post(`${API_BASE_URL}/add`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Backend Response:", JSON.stringify(response.data, null, 2));
      console.log("Response Status:", response.status);

      if (response.status === 201) {
        setSuccessMessage("Purchase Invoice added successfully!");
        setErrorMessage("");

        setInvoiceData({
          supplierId: "",
          purchaseOrderRef: "",
          lineItemsList: [{ product: "", quantity: "", price: "", focQty: 0, discount: 0 }],
          invoiceNo: "",
          invoiceDate: "",
          invoiceStatus: "",
          paymentType: "",
          totalAmount: 0,
          discountAmount: 0,
          netAmount: 0,
          notes: "",
        });

        if (onAddPurchaseInvoice) {
          onAddPurchaseInvoice(response.data.data);
        }

        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error submitting invoice:", error.response || error);
      setErrorMessage("Failed to add purchase invoice: " + (error.response?.data?.message || error.message));
    }
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
        <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>
      )}

      {/* Header Section */}
      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">Supplier ID:</label>
            <select
              name="supplierId"
              value={invoiceData.supplierId}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
              disabled={loadingSuppliers}
            >
              <option value="">Choose a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.supplier_name} ({supplier.supplier_id})
                </option>
              ))}
            </select>
            {loadingSuppliers && <p className="text-sm text-gray-500">Loading suppliers...</p>}
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">Purchase Order Reference:</label>
            <input
              type="text"
              name="purchaseOrderRef"
              value={invoiceData.purchaseOrderRef}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">Invoice Number:</label>
            <input
              type="text"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">Invoice Status:</label>
            <select
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
            <label className="w-full text-sm text-gray-800">Invoice Date:</label>
            <input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleInputChange}
              className="w-full px-2 py-1 mt-1 text-sm border border-red-500 rounded-md"
            />
          </div>
          <div className="w-1/3">
            <label className="w-full text-sm text-gray-800">Payment Type:</label>
            <select
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
          <label className="text-sm text-gray-800">Notes:</label>
          <input
            type="text"
            name="notes"
            value={invoiceData.notes}
            onChange={handleInputChange}
            className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md"
            placeholder="Enter any additional notes"
          />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-4">
        <table className="w-full border border-collapse border-gray-300">
          <thead className="bg-[#1a5353] text-white">
            <tr>
              <th className="p-2 text-left border border-gray-300">Product ID</th>
              <th className="p-2 text-left border border-gray-300">Quantity</th>
              <th className="p-2 text-left border border-gray-300">FOC Qty</th>
              <th className="p-2 text-left border border-gray-300">Cost Price</th>
              <th className="p-2 text-left border border-gray-300">Disc %</th>
              <th className="p-2 text-left border border-gray-300">Value</th>
              <th className="p-2 text-left border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItemsList.map((item, index) => (
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

      {/* Footer Section */}
      <div className="p-4 mb-4 bg-white border border-gray-300 rounded-md">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-800">Total:</label>
            <span className="w-full px-2 py-1 mt-1 text-sm bg-white border border-gray-300 rounded-md">
              {invoiceData.lineItemsList.length > 0 ? calculateTotals().totalAmount.toFixed(2) : "0.00"}
            </span>
          </div>
          <div>
            <label className="text-sm text-gray-800">Discount Amount:</label>
            <input
              type="number"
              name="discountAmount"
              value={invoiceData.discountAmount}
              onChange={handleInputChange}
              onBlur={() => {
                const { totalAmount, netAmount } = calculateTotals();
                setInvoiceData((prev) => ({ ...prev, totalAmount, netAmount }));
              }}
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
              {invoiceData.lineItemsList.length > 0 ? calculateTotals().netAmount.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
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