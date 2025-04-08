/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPurchaseInvoices, getPurchaseInvoiceById } from "../../../../../api/InvoiceApiService";
import PurchaseInvoiceDetailsModal from "../../../../Modals/PurchaseInvoiceDetailsModal";
import formatBackendDate from "../../../../../util/FormatDateString";

const PurchaseInvoiceInfoTable = () => {
  const [search, setSearch] = useState("");
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const navigate = useNavigate();

  // Fetch real purchase invoices from the API
  useEffect(() => {
    const fetchPurchaseInvoices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAllPurchaseInvoices();
        console.log("API Response:", response); // For debugging

        if (response?.data?.code === 200) {
          const invoices = response.data.data;
          if (Array.isArray(invoices) && invoices.length > 0) {
            setPurchaseInvoices(invoices);
          } else {
            setPurchaseInvoices([]);
            console.warn("No purchase invoices found in response");
          }
        } else {
          setError("Failed to fetch purchase invoices: Invalid response format");
          setPurchaseInvoices([]);
        }
      } catch (err) {
        console.error("Failed to fetch purchase invoices:", err);
        setError(err.message || "Failed to load purchase invoices");
        setPurchaseInvoices([]);
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

  // View invoice details - using only invoiceId as intended
  const handleViewPurchaseInvoice = async (invoice) => {
    try {
      // Log the invoice object for debugging
      console.log("Invoice object received:", invoice);

      // Use only invoiceId - no longer using invoiceNo as a fallback
      const invoiceId = invoice?.invoiceId;

      if (!invoiceId) {
        console.error("Missing invoice ID:", invoice);
        setError("Cannot view details: Invoice ID is missing. This invoice may not have been properly saved with an ID.");
        return;
      }

      console.log(`Fetching invoice details for ID: ${invoiceId}`);
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await getPurchaseInvoiceById(invoiceId);

        if (response && response.data && response.data.code === 200) {
          console.log("Successfully fetched invoice details:", response.data.data);
          setSelectedInvoice(response.data.data);
        } else {
          console.error("Unexpected API response format:", response);
          setError(`Failed to load invoice details: Invalid response format`);
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        if (apiError.status === 404) {
          setError(`Invoice with ID ${invoiceId} not found.`);
        } else {
          setError(`${apiError.message || 'Failed to load invoice details'}`);
        }
      }
    } catch (error) {
      console.error("Error in view invoice handler:", error);
      setError(`Failed to process request: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
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
                    {invoice.invoiceDate ?
                      formatBackendDate(invoice.invoiceDate) :
                      "N/A"
                    }
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

      {selectedInvoice && (
        <PurchaseInvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default PurchaseInvoiceInfoTable;