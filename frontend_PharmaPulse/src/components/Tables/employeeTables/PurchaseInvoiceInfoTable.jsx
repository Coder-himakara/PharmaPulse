/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PurchaseInvoiceInfoTable = ({ purchaseInvoices }) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Filter the purchase invoices based on the search term
  const filteredPurchaseInvoices = purchaseInvoices.filter((purchaseInvoice) =>
    purchaseInvoice.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  // Close button action
  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  // Edit button action
  const handleEdit = (purchaseInvoiceId) => {
    const purchaseInvoice = purchaseInvoices.find(
      (pi) => pi.purchaseInvoiceId === purchaseInvoiceId
    );
    navigate(`/edit-purchase-invoice/${purchaseInvoiceId}`, {
      state: { purchaseInvoice },
    });
  };

  const handleViewPurchaseInvoice = (purchaseInvoice) => {
    navigate(`/view-purchase-invoice/${purchaseInvoice.purchaseInvoiceId}`, {
      state: { purchaseInvoice },
    });
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
            placeholder="Search Purchase Invoice..."
            value={search}
            onChange={(pi) => setSearch(pi.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {/* Display message when no search results */}
      {filteredPurchaseInvoices.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No purchase invoices found matching your search.
        </div>
      )}

      {/* Table displaying purchase invoices */}
      <div className="p-2 overflow-x-auto">
        <table className="w-full border border-collapse border-gray-400">
          <thead>
            <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
              {[
                "Invoice No",
                "Supplier ID",
                "Purchase Order Ref",
                "Invoice Date",
                "Total Amount",
                "Discount",
                "Net Amount",
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
            {filteredPurchaseInvoices.map((purchaseInvoice, index) => (
              <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.invoiceNo}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.supplierId}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.purchaseOrderRef}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.invoiceDate}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.totalAmount}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.discountAmount}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  {purchaseInvoice.netAmount}
                </td>
                <td className="p-2 text-center border border-gray-400">
                  <button
                    onClick={() =>
                      handleEdit(purchaseInvoice.purchaseInvoiceId)
                    }
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                    onClick={() => handleViewPurchaseInvoice(purchaseInvoice)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PurchaseInvoiceInfoTable.propTypes = {
  purchaseInvoices: PropTypes.arrayOf(
    PropTypes.shape({
      invoiceNo: PropTypes.string.isRequired,
      supplierId: PropTypes.string.isRequired,
      purchaseOrderRef: PropTypes.string.isRequired,
      invoiceDate: PropTypes.string.isRequired,
      totalAmount: PropTypes.number.isRequired,
      discountAmount: PropTypes.number.isRequired,
      netAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PurchaseInvoiceInfoTable;
