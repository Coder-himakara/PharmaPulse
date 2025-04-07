/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPurchaseInvoices } from "../../../../../api/InvoiceApiService";

const PurchaseInvoiceInfoTable = () => {
  const [search, setSearch] = useState("");
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  
  const navigate = useNavigate();

  // Fetch real purchase invoices from the API
  useEffect(() => {
    const fetchPurchaseInvoices = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching purchase invoices from API...");
        
        const response = await getAllPurchaseInvoices();
        const rawResponseData = JSON.stringify(response.data, null, 2);
        setDebugInfo(rawResponseData);
        console.log("Complete API Response:", response);
        
        if (!response || !response.data) {
          throw new Error("Invalid API response format");
        }
        
        // Handle response based on your backend structure
        let fetchedInvoices = [];
        
        if (Array.isArray(response.data)) {
          // Direct array in response.data
          fetchedInvoices = response.data;
          console.log("Found direct array of invoices:", fetchedInvoices);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Nested array in response.data.data (standard structure)
          fetchedInvoices = response.data.data;
          console.log("Found nested array of invoices:", fetchedInvoices);
        } else if (response.data.code === 200 && response.data.data) {
          // StandardResponse with data property (not an array)
          const dataProperty = response.data.data;
          
          if (Array.isArray(dataProperty)) {
            fetchedInvoices = dataProperty;
            console.log("Found array in StandardResponse.data:", fetchedInvoices);
          } else {
            console.warn("Data property exists but is not an array:", dataProperty);
            // Try to convert to array if possible
            if (dataProperty && typeof dataProperty === 'object') {
              const possibleInvoices = Object.values(dataProperty);
              if (possibleInvoices.length > 0) {
                fetchedInvoices = possibleInvoices;
                console.log("Converted object to array:", fetchedInvoices);
              }
            }
          }
        } else if (response.data.code === 200 && !response.data.data) {
          console.warn("API returned success but no invoice data found");
          // This is a success response but with no data
          fetchedInvoices = [];
        } else {
          console.warn("Unexpected API response structure:", response.data);
          fetchedInvoices = [];
        }
        
        setPurchaseInvoices(fetchedInvoices);
      } catch (err) {
        console.error("Failed to fetch purchase invoices:", err);
        setError(`Failed to load purchase invoices: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseInvoices();
  }, []);

  // Filter the purchase invoices based on the search term
  const filteredPurchaseInvoices = purchaseInvoices.filter((invoice) => {
    if (!search) return true;
    
    // Check if invoiceNo exists before filtering
    return invoice.invoiceNo && 
           invoice.invoiceNo.toString().toLowerCase().includes(search.toLowerCase());
  });

  // Close button action
  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  // View invoice details
  const handleViewPurchaseInvoice = (invoice) => {
    console.log("Viewing invoice details:", invoice);
    navigate(
      `/employee-dashboard/edit-purchase-invoice/${invoice.invoiceId}`,
      { state: { purchaseInvoice: invoice } }
    );
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Purchase Invoices Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Purchase Invoices</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Invoice No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center p-4">
          <p>Loading purchase invoices...</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold p-4">
          {error}
        </div>
      )}

      {/* No search results */}
      {!isLoading && filteredPurchaseInvoices.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No purchase invoices found matching your search.
        </div>
      )}

      {/* No invoices available */}
      {!isLoading && purchaseInvoices.length === 0 && !search && !error && (
        <div className="text-gray-600 text-sm text-center mt-2 p-4">
          <p>No purchase invoices available in the database.</p>
          <p className="mt-2">Database is returning a success response but no invoice data.</p>
          <p className="mt-2 text-blue-600">
            You may need to add purchase invoices through the &quot;Add Invoice&quot; functionality.
          </p>
          
          {/* Debug information - only display in development */}
          <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
            <p className="font-medium mb-2">API Response Debug Info:</p>
            <pre className="text-xs text-left whitespace-pre-wrap overflow-x-auto max-h-36 bg-white p-2 border border-gray-200">
              {debugInfo}
            </pre>
          </div>
        </div>
      )}

      {/* Table displaying purchase invoices */}
      {!isLoading && filteredPurchaseInvoices.length > 0 && (
        <div className="p-2 overflow-x-auto">
          <table className="w-full border border-collapse border-gray-400">
            <thead>
              <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
                {[
                  "Invoice No",
                  "Supplier ID",
                  "Purchase Order Ref",
                  "Invoice Date",
                  "Total Amount (Rs.)",
                  "Discount (Rs.)",
                  "Net Amount (Rs.)",
                  "Action",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="p-2 text-center border border-gray-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredPurchaseInvoices.map((invoice, index) => (
                <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                  <td className="p-2 text-center border border-gray-400">
                    {invoice.invoiceNo || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {invoice.supplierId || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {invoice.purchaseOrderRef || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {typeof invoice.totalAmount === 'number' ? 
                      invoice.totalAmount.toFixed(2) : 
                      parseFloat(invoice.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {typeof invoice.discountAmount === 'number' ? 
                      invoice.discountAmount.toFixed(2) : 
                      parseFloat(invoice.discountAmount || 0).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {typeof invoice.netAmount === 'number' ? 
                      invoice.netAmount.toFixed(2) : 
                      parseFloat(invoice.netAmount || 0).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    <button
                      className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]"
                      onClick={() => handleViewPurchaseInvoice(invoice)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseInvoiceInfoTable;