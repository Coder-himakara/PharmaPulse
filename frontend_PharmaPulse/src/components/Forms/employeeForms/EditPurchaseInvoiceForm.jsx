/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditPurchaseInvoiceForm = ({ onUpdatePurchaseInvoice }) => {
  const { state } = useLocation();
  const purchaseInvoice = state?.purchaseInvoice;
  const navigate = useNavigate();

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
    lineItems: [{ product: "", quantity: "", price: "" }],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (purchaseInvoice) {
      setInvoiceData({
        purchaseNo: purchaseInvoice.purchaseNo || "",
        supplierId: purchaseInvoice.supplierId || "",
        purchaseOrderRef: purchaseInvoice.purchaseOrderRef || "",
        purchaseInvoiceId: purchaseInvoice.purchaseInvoiceId || "",
        invoiceStatus: purchaseInvoice.invoiceStatus || "",
        invoiceDate: purchaseInvoice.invoiceDate || "",
        invoiceNo: purchaseInvoice.invoiceNo || "",
        paymentType: purchaseInvoice.paymentType || "",
        totalAmount: purchaseInvoice.totalAmount || 0,
        discountAmount: purchaseInvoice.discountAmount || 0,
        netAmount: purchaseInvoice.netAmount || 0,
        lineItems: purchaseInvoice.lineItems || [{ product: "", quantity: "", price: "" }],
      });
    }
  }, [purchaseInvoice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        { product: "", quantity: "", price: "" },
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

    if (
      !invoiceData.purchaseNo ||
      !invoiceData.supplierId ||
      !invoiceData.purchaseOrderRef ||
      !invoiceData.purchaseInvoiceId ||
      !invoiceData.invoiceStatus ||
      !invoiceData.invoiceDate ||
      !invoiceData.invoiceNo ||
      !invoiceData.paymentType ||
      !invoiceData.totalAmount ||
      !invoiceData.discountAmount ||
      !invoiceData.netAmount ||
      !invoiceData.lineItems.length
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");

    if (onUpdatePurchaseInvoice) {
      onUpdatePurchaseInvoice(invoiceData);
    }

    setSuccessMessage("Purchase Invoice updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/purchase-invoice-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/purchase-invoice-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Purchase Invoice
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
          {successMessage}
        </p>
      )}

      {/* Form Grid Layout mimicking the invoice structure */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="purchaseNo"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Purchase Number:
            </label>
            <input
              type="number"
              name="purchaseNo"
              value={invoiceData.purchaseNo}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-500 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="supplierId"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Supplier ID:
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={invoiceData.supplierId}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a supplier</option>
              <option value="S001">S001</option>
              <option value="S002">S002</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="purchaseOrderRef"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Purchase Order Reference:
            </label>
            <input
              type="text"
              name="purchaseOrderRef"
              value={invoiceData.purchaseOrderRef}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="purchaseInvoiceId"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Purchase Invoice ID:
            </label>
            <input
              type="text"
              name="purchaseInvoiceId"
              value={invoiceData.purchaseInvoiceId}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="invoiceStatus"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Invoice Status:
            </label>
            <select
              id="invoiceStatus"
              name="invoiceStatus"
              value={invoiceData.invoiceStatus}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a status</option>
              <option value="PAID">Paid</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="invoiceDate"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Invoice Date:
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Right Column with Line Items and Buttons at the Bottom */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="invoiceNo"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Invoice Number:
            </label>
            <input
              type="number"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-red-500 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="paymentType"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Payment Type:
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={invoiceData.paymentType}
              onChange={handleInputChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a payment type</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CONLINE TRANSACTION">Online Transaction</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="discountAmount"
              className="text-[16px] text-gray-800 w-1/2"
            >
              Discount Amount:
            </label>
            <input
              type="number"
              name="discountAmount"
              value={invoiceData.discountAmount}
              onChange={(e) => handleInputChange(e)}
              onBlur={calculateTotals}
              className="w-1/2 px-2 py-2 text-sm border border-red-500 rounded-md"
              min="0"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lineItems"
              className="text-[16px] text-gray-800 block mb-2"
            >
              Line Items:
            </label>
            {invoiceData.lineItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 mb-2"
              >
                <input
                  type="text"
                  placeholder="Product"
                  value={item.product}
                  onChange={(e) =>
                    handleLineItemChange(index, "product", e.target.value)
                  }
                  className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleLineItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-1/3 px-2 py-2 text-sm border border-red-500 rounded-md"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleLineItemChange(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-1/3 px-2 py-2 text-sm border border-red-500 rounded-md"
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  className="bg-[#4c85a6] text-white py-1 px-2 rounded-md text-sm hover:bg-[#15375c]"
                >
                  X
                </button>
              </div>
            ))}
            <div className="mt-2">
              <button
                type="button"
                onClick={addLineItem}
                className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]"
              >
                Add Line Item
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <strong className="text-[16px] text-gray-800">Total Amount:</strong>
            <span>{invoiceData.totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <strong className="text-[16px] text-gray-800">Net Amount:</strong>
            <span>{invoiceData.netAmount.toFixed(2)}</span>
          </div>

          {/* Buttons at Bottom-Right */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
            >
              Update
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

EditPurchaseInvoiceForm.propTypes = {
  onUpdatePurchaseInvoice: PropTypes.func.isRequired,
};

export default EditPurchaseInvoiceForm;