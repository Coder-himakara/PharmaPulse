/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { addPurchaseInvoice, getAllSuppliers, getAllProducts } from "../../../../../api/InvoiceApiService";


// Add this import if you have an auth service
// import { refreshToken } from "../../../../../api/AuthService";

const AddPurchaseInvoiceForm = ({ onAddPurchaseInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceStatus: "",
    invoiceDate: "",
    invoiceNo: "",
    paymentType: "",
    totalAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    supplierId: "",
    purchaseOrderRef: "",
    lineItemsList: [],
  });

  const [lineItemInput, setLineItemInput] = useState({
    productId: "",
    quantity: 0,
    freeQuantity: 0,
    discountAmount: 0,
    manufactureDate: "",
    expiryDate: "",
    unitPrice: 0,
    totalPrice: 0,
    retailPrice: 0,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await getAllSuppliers();
        console.log("Suppliers Response:", supplierResponse.data);
        const fetchedSuppliers = supplierResponse.data.data || [];
        setSuppliers(fetchedSuppliers);

        const productResponse = await getAllProducts();
        console.log("Products Response:", productResponse.data);
        const fetchedProducts = productResponse.data.data || [];
        setProducts(fetchedProducts);
        console.log("Set Products:", fetchedProducts); // Debug to ensure products are set
      } catch (error) {
        setErrorMessage("Failed to load suppliers or products: " + (error.response?.data?.message || error.message));
        console.error("Fetch Error:", error.response || error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "discountAmount") {
        updated.netAmount = updated.totalAmount - (parseFloat(value) || 0);
      }
      return updated;
    });
  };

  const handleLineItemInputChange = (e) => {
    const { name, value } = e.target;
    setLineItemInput((prev) => {
      const updated = {
        ...prev,
        [name]:
          name === "quantity" || name === "freeQuantity"
            ? parseInt(value) || 0
            : name === "discountAmount" || name === "unitPrice" || name === "retailPrice"
            ? parseFloat(value) || 0
            : value,
      };
      updated.totalPrice =
        (parseInt(updated.quantity) || 0) * (parseFloat(updated.unitPrice) || 0) -
        (parseFloat(updated.discountAmount) || 0);
      return updated;
    });
  };

  const addLineItemToTable = () => {
    // Validate required fields but make expiry date optional for some products
    if (
      !lineItemInput.productId ||
      !lineItemInput.quantity ||
      !lineItemInput.unitPrice ||
      !lineItemInput.manufactureDate
    ) {
      setErrorMessage("Please fill all required fields for the line item (Product, Quantity, Unit Price, Manufacture Date).");
      return;
    }

    // Additional validation
    if (lineItemInput.quantity <= 0) {
      setErrorMessage("Quantity must be greater than 0.");
      return;
    }
    if (lineItemInput.unitPrice < 0) {
      setErrorMessage("Unit price cannot be negative.");
      return;
    }
    if (lineItemInput.discountAmount < 0) {
      setErrorMessage("Discount amount cannot be negative.");
      return;
    }
    // Only validate expiry date if provided
    if (lineItemInput.expiryDate && lineItemInput.manufactureDate && 
        new Date(lineItemInput.expiryDate) <= new Date(lineItemInput.manufactureDate)) {
      setErrorMessage("Expiry date must be after manufacture date.");
      return;
    }

    setInvoiceData((prev) => {
      const updatedList = [...prev.lineItemsList, { ...lineItemInput }];
      const totalAmount = updatedList.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      const totalDiscount = updatedList.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
      const netAmount = totalAmount - totalDiscount - (parseFloat(prev.discountAmount) || 0);
      return { ...prev, lineItemsList: updatedList, totalAmount, netAmount };
    });

    setLineItemInput({
      productId: "",
      quantity: 0,
      freeQuantity: 0,
      discountAmount: 0,
      manufactureDate: "",
      expiryDate: "",
      unitPrice: 0,
      totalPrice: 0,
      retailPrice: 0,
    });
    setErrorMessage("");
  };

  const removeLineItem = (index) => {
    if (window.confirm("Are you sure you want to remove this line item?")) {
      setInvoiceData((prev) => {
        const updatedList = prev.lineItemsList.filter((_, idx) => idx !== index);
        const totalAmount = updatedList.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const totalDiscount = updatedList.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
        const netAmount = totalAmount - totalDiscount - (parseFloat(prev.discountAmount) || 0);
        return { ...prev, lineItemsList: updatedList, totalAmount, netAmount };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Regular field validation
    const requiredFields = ["supplierId", "purchaseOrderRef", "invoiceNo", "invoiceDate", "invoiceStatus", "paymentType"];
    if (requiredFields.some((field) => !invoiceData[field])) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    if (invoiceData.lineItemsList.length === 0) {
      setErrorMessage("Please add at least one line item.");
      setIsLoading(false);
      return;
    }

    // Map paymentType to match the backend enum
    const paymentTypeMapping = {
      "CASH": "CASH",
      "CHEQUE": "CHEQUE",
      "ONLINE TRANSACTION": "ONLINE_TRANSACTION"
    };

    try {
      // Format date properly for backend (ISO format without milliseconds)
      const formattedDate = new Date(invoiceData.invoiceDate).toISOString().split('.')[0];
      
      const payload = {
        invoiceStatus: invoiceData.invoiceStatus,
        invoiceDate: formattedDate, // Properly formatted date
        invoiceNo: invoiceData.invoiceNo,
        paymentType: paymentTypeMapping[invoiceData.paymentType] || invoiceData.paymentType,
        totalAmount: Number(invoiceData.totalAmount),
        discountAmount: Number(parseFloat(invoiceData.discountAmount) || 0),
        netAmount: Number(invoiceData.netAmount),
        supplierId: Number(invoiceData.supplierId),
        purchaseOrderRef: invoiceData.purchaseOrderRef,
        lineItemsList: invoiceData.lineItemsList.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          freeQuantity: Number(item.freeQuantity || 0),
          discountAmount: Number(item.discountAmount || 0),
          // Handle dates properly - allow null for expiry date
          manufactureDate: item.manufactureDate,
          expiryDate: item.expiryDate || null, // Send null if not provided
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
          retailPrice: Number(item.retailPrice || 0),
        })),
      };

      console.log("Submitting Payload:", JSON.stringify(payload, null, 2));
      const response = await addPurchaseInvoice(payload);
      console.log("Response from Backend:", response.data);
      setSuccessMessage("Purchase Invoice added successfully! You can now add another one.");
      if (onAddPurchaseInvoice) {
        onAddPurchaseInvoice(response.data.data);
      }
      
      // Reset form without navigating away
      setInvoiceData({
        invoiceStatus: "",
        invoiceDate: "",
        invoiceNo: "",
        paymentType: "",
        totalAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        supplierId: "",
        purchaseOrderRef: "",
        lineItemsList: [],
      });
      
      // Optional: Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
      // Remove the navigation line to stay on the same page
      // navigate("/employee-dashboard/purchase-invoices");
    } catch (error) {
      console.error("Submit Error Details:", error);
      let errorMsg = "Failed to add purchase invoice";
      
      if (error.response) {
        // Handle JWT expiration specifically
        if (error.response.data?.details?.includes("JWT expired")) {
          errorMsg = "Your session has expired. Please log in again.";
          
          // Option 1: Redirect to login
          setTimeout(() => {
            // Clear any auth tokens from storage
            localStorage.removeItem("token"); // Or however you store your token
            sessionStorage.removeItem("token");
            
            // Redirect to login page
            navigate("/login");
          }, 2000);
          
          // Option 2: Refresh token (if your API supports this)
          // Uncomment if you have token refresh functionality
          /*
          try {
            await refreshToken();
            // Try the submission again
            const retryResponse = await addPurchaseInvoice(payload);
            console.log("Retry Response:", retryResponse.data);
            setSuccessMessage("Purchase Invoice added successfully!");
            return;
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
            return;
          }
          */
        } else {
          // Handle other API errors
          console.error("Error Response Data:", error.response.data);
          errorMsg += `: ${error.response.status} - ${error.response.data?.message || error.response.data?.details || error.response.statusText || "Unknown server error"}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMsg += ": No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMsg += `: ${error.message}`;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/purchase-invoices");
  };

  const totalDiscount = invoiceData.lineItemsList.reduce((sum, item) => sum + (item.discountAmount || 0), 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-6 bg-[#e6eef3] border border-gray-300 rounded-lg shadow-lg"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-3 rounded-t-md mb-6 text-xl font-semibold">
        Add Purchase Invoice
      </h2>

      {errorMessage && <p className="mb-4 text-sm font-bold text-center text-[#991919]">{errorMessage}</p>}
      {successMessage && <p className="mb-4 text-sm font-bold text-center text-[#3c5f3c]">{successMessage}</p>}

      {/* Header Section */}
      <div className="p-5 mb-6 bg-white border border-gray-200 rounded-md shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">Invoice Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Supplier:</label>
            <select
              name="supplierId"
              value={invoiceData.supplierId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.supplier_name} (ID: {supplier.supplier_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Purchase Order Ref:</label>
            <input
              type="text"
              name="purchaseOrderRef"
              value={invoiceData.purchaseOrderRef}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Invoice No:</label>
            <input
              type="text"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Invoice Date:</label>
            <input
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status:</label>
            <select
              name="invoiceStatus"
              value={invoiceData.invoiceStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            >
              <option value="">Select Status</option>
              <option value="PAID">Paid</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Payment Type:</label>
            <select
              name="paymentType"
              value={invoiceData.paymentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              required
            >
              <option value="">Select Payment Type</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="ONLINE TRANSACTION">Online Transaction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Line Item Input Section - Improved */}
      <div className="p-5 mb-6 bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Add Line Item</h3>
          <div className="text-xs text-gray-500">* Required fields</div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Left Column - Core Product Info */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product: <span className="text-red-500">*</span>
              </label>
              <select
                name="productId"
                value={lineItemInput.productId}
                onChange={handleLineItemInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName} (ID: {product.productId})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={lineItemInput.quantity}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Free Quantity:
                </label>
                <input
                  type="number"
                  name="freeQuantity"
                  value={lineItemInput.freeQuantity}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Unit Price: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={lineItemInput.unitPrice}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Retail Price:
                </label>
                <input
                  type="number"
                  name="retailPrice"
                  value={lineItemInput.retailPrice}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Dates and Additional Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Manufacture Date: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={lineItemInput.manufactureDate}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Expiry Date:
                  <span className="ml-1 text-xs text-gray-500">(if applicable)</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={lineItemInput.expiryDate}
                  onChange={handleLineItemInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Discount Amount:
              </label>
              <input
                type="number"
                name="discountAmount"
                value={lineItemInput.discountAmount}
                onChange={handleLineItemInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-700">Total Price:</div>
                <div className="font-medium text-gray-900">{lineItemInput.totalPrice.toFixed(2)}</div>
              </div>
              <button
                type="button"
                onClick={addLineItemToTable}
                className="w-full px-4 py-2 bg-[#4c85a6] text-white rounded-md text-sm font-medium hover:bg-[#15375c] transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-medium text-gray-800">Line Items</h3>
        {invoiceData.lineItemsList.length === 0 ? (
          <p className="text-sm italic text-gray-600">No line items added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse border-gray-300">
              <thead className="bg-[#1a5353] text-white">
                <tr>
                  <th className="p-3 text-left border border-gray-300">Product</th>
                  <th className="p-3 text-left border border-gray-300">Qty</th>
                  <th className="p-3 text-left border border-gray-300">Free Qty</th>
                  <th className="p-3 text-left border border-gray-300">Unit Price</th>
                  <th className="p-3 text-left border border-gray-300">Discount</th>
                  <th className="p-3 text-left border border-gray-300">Mfg Date</th>
                  <th className="p-3 text-left border border-gray-300">Exp Date</th>
                  <th className="p-3 text-left border border-gray-300">Retail Price</th>
                  <th className="p-3 text-left border border-gray-300">Total</th>
                  <th className="p-3 text-left border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.lineItemsList.map((item, index) => {
                  const product = products.find((p) => p.productId === parseInt(item.productId));
                  return (
                    <tr key={index} className="border border-gray-300 hover:bg-gray-50">
                      <td className="p-3 border border-gray-300">
                        {product ? product.productName : "Unknown (ID: " + item.productId + ")"}
                      </td>
                      <td className="p-3 border border-gray-300">{item.quantity}</td>
                      <td className="p-3 border border-gray-300">{item.freeQuantity}</td>
                      <td className="p-3 border border-gray-300">{item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 border border-gray-300">{item.discountAmount.toFixed(2)}</td>
                      <td className="p-3 border border-gray-300">{item.manufactureDate}</td>
                      <td className="p-3 border border-gray-300">{item.expiryDate}</td>
                      <td className="p-3 border border-gray-300">{item.retailPrice.toFixed(2)}</td>
                      <td className="p-3 border border-gray-300">{item.totalPrice.toFixed(2)}</td>
                      <td className="p-3 border border-gray-300">
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="bg-[#4c85a6] text-white py-1 px-3 rounded-md text-sm hover:bg-[#15375c] transition-colors"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Section - Improved */}
      <div className="p-5 mb-6 bg-white border border-gray-200 rounded-md shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-800">Invoice Summary</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-4 rounded-md bg-gray-50">
            <label className="block mb-2 text-sm font-medium text-gray-700">Total Amount:</label>
            <div className="text-xl font-semibold text-gray-800">
              Rs. {invoiceData.totalAmount.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-md bg-gray-50">
            <label className="block mb-2 text-sm font-medium text-gray-700">Discount:</label>
            <div className="flex items-center mb-2 space-x-2">
              <div className="text-xl font-semibold text-gray-800">
                Rs. {(totalDiscount + (parseFloat(invoiceData.discountAmount) || 0)).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                ({totalDiscount.toFixed(2)} + {(parseFloat(invoiceData.discountAmount) || 0).toFixed(2)})
              </div>
            </div>
            <input
              type="number"
              name="discountAmount"
              value={invoiceData.discountAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a4d69]"
              min="0"
              step="0.01"
              placeholder="Additional Invoice Discount"
            />
          </div>
          <div className="p-4 rounded-md bg-gray-50">
            <label className="block mb-2 text-sm font-medium text-gray-700">Net Payable Amount:</label>
            <div className="text-xl font-semibold text-green-600">
              Rs. {invoiceData.netAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Improved */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md text-base font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-[#2a4d69] text-white rounded-md text-base font-medium hover:bg-[#00796b] transition-colors disabled:opacity-50 inline-flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Invoice"
          )}
        </button>
        {successMessage && (
          <button
            type="button"
            onClick={() => navigate("/employee-dashboard/purchase-invoices")}
            className="px-6 py-2.5 bg-[#4c85a6] text-white rounded-md text-base font-medium hover:bg-[#15375c] transition-colors"
          >
            View All Invoices
          </button>
        )}
      </div>
    </form>
  );
};

AddPurchaseInvoiceForm.propTypes = {
  onAddPurchaseInvoice: PropTypes.func,
};

AddPurchaseInvoiceForm.defaultProps = {
  onAddPurchaseInvoice: () => {},
};

export default AddPurchaseInvoiceForm;