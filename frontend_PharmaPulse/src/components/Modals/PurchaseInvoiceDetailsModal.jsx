import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSupplierById } from '../../api/InvoiceApiService';

const PurchaseInvoiceDetailsModal = ({ invoice, onClose }) => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Invoice data received in modal:', invoice);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get supplier ID, handling different possible property names
        const supplierId = invoice?.supplierId || invoice?.supplier_id;

        if (!supplierId) {
          console.warn('Supplier ID not found in invoice data:', invoice);
          setError('Supplier ID not found in invoice data');
          setLoading(false);
          return;
        }

        console.log(`Fetching supplier details for ID: ${supplierId}`);
        const response = await getSupplierById(supplierId);

        if (response?.data?.code === 200) {
          console.log(
            'Successfully fetched supplier details:',
            response.data.data,
          );
          setSupplier(response.data.data);
        } else {
          console.error(
            'Unexpected API response format for supplier:',
            response,
          );
          setError('Failed to load supplier details: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching supplier details:', error);
        setError(
          `Failed to load supplier details: ${error.message || 'Unknown error'}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [invoice]);

  if (!invoice) return null;

  // Format dates properly with enhanced error handling for arrays
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      // Special handling for array dates [year, month, day, hour, minute]
      if (Array.isArray(dateString)) {
        if (dateString.length >= 3) {
          const [year, month, day] = dateString;
          // Month in JS Date is 0-indexed (0=Jan, 1=Feb)
          const newDate = new Date(year, month - 1, day);
          if (!isNaN(newDate.getTime())) {
            return newDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          }
        }
        console.warn('Array date could not be parsed:', dateString);
        return `${dateString[0]}-${dateString[1]}-${dateString[2]}`;
      }

      // First try parsing as is for string dates
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        // If invalid, try alternative parsing methods for strings
        if (typeof dateString === 'string') {
          // Try ISO format with time component removed (for LocalDate)
          if (dateString.includes('T')) {
            const simplifiedDate = dateString.split('T')[0];
            const newDate = new Date(simplifiedDate);
            if (!isNaN(newDate.getTime())) {
              return newDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            }
          }

          // Try parsing as yyyy-MM-dd format
          const parts = dateString.split('-');
          if (parts.length === 3) {
            const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
            if (!isNaN(newDate.getTime())) {
              return newDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            }
          }
        }

        console.warn('Failed to parse date:', dateString);
        return 'Invalid Date Format';
      }

      // If valid, format the date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error parsing date:', e, dateString);
      return 'Date Error';
    }
  };

  // Access line items safely with proper handling for different structures
  const lineItems = Array.isArray(invoice.lineItems)
    ? invoice.lineItems
    : invoice.purchaseLineItems
      ? invoice.purchaseLineItems
      : [];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[80%] max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b'>
          <h2 className='text-2xl font-bold text-[#1a5353]'>
            Invoice Details - #{invoice.invoiceNo || 'N/A'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100'
          >
            ✕
          </button>
        </div>

        {/* Debug information - useful during development */}
        {/* {process.env.NODE_ENV !== 'production' && (
          <div className="bg-gray-100 p-2 mb-4 text-xs overflow-auto max-h-32">
            <p className="font-semibold mb-1">Debug Information:</p>
            <pre>{JSON.stringify(invoice, null, 2)}</pre>
          </div>
        )} */}

        {/* Error display */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-4'>
            <p className='font-medium'>Error: {error}</p>
          </div>
        )}

        <div className='space-y-6'>
          {/* Invoice Information */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-bold text-lg mb-3 text-[#1a5353]'>
              Invoice Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Invoice #:</span>{' '}
                  {invoice.invoiceNo || 'N/A'}
                </p>
                <p>
                  <span className='font-semibold'>Date:</span>{' '}
                  {formatDate(invoice.invoiceDate)}
                </p>
                <p>
                  <span className='font-semibold'>Status:</span>
                  <span
                    className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      invoice.invoiceStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : invoice.invoiceStatus === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : invoice.invoiceStatus === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {invoice.invoiceStatus || 'N/A'}
                  </span>
                </p>
              </div>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Payment Type:</span>{' '}
                  {invoice.paymentType || 'N/A'}
                </p>
                <p>
                  <span className='font-semibold'>PO Reference:</span>{' '}
                  {invoice.purchaseOrderRef || 'N/A'}
                </p>
                <p>
                  <span className='font-semibold'>Invoice ID:</span>{' '}
                  {invoice.invoiceId || 'N/A'}
                </p>
              </div>
              <div className='space-y-2 bg-[#e6eef3] p-3 rounded-md'>
                <p className='font-semibold text-[#1a5353]'>
                  Financial Summary
                </p>
                <p>
                  <span className='font-semibold'>Total Amount:</span> Rs.{' '}
                  {parseFloat(invoice.totalAmount || 0).toFixed(2)}
                </p>
                <p>
                  <span className='font-semibold'>Discount:</span> Rs.{' '}
                  {parseFloat(invoice.discountAmount || 0).toFixed(2)}
                </p>
                <p className='text-lg font-bold text-green-600'>
                  Net Amount: Rs.{' '}
                  {parseFloat(invoice.netAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-bold text-lg mb-3 text-[#1a5353]'>
              Supplier Information
            </h3>
            {loading ? (
              <div className='py-4 text-center text-gray-600'>
                Loading supplier details...
              </div>
            ) : supplier ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <p>
                    <span className='font-semibold'>Name:</span>{' '}
                    {supplier.supplier_name || 'N/A'}
                  </p>
                  <p>
                    <span className='font-semibold'>Email:</span>{' '}
                    {supplier.supplier_email || 'N/A'}
                  </p>
                  <p>
                    <span className='font-semibold'>Contact:</span>{' '}
                    {supplier.supplier_contactNo || 'N/A'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p>
                    <span className='font-semibold'>Address:</span>{' '}
                    {supplier.supplier_address || 'N/A'}
                  </p>
                  <p>
                    <span className='font-semibold'>Credit Limit:</span> Rs.{' '}
                    {parseFloat(supplier.credit_limit || 0).toFixed(2)}
                  </p>
                  <p>
                    <span className='font-semibold'>Outstanding Balance:</span>{' '}
                    Rs.{' '}
                    {parseFloat(supplier.outstanding_balance || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className='py-4 text-center text-gray-600'>
                {error ? (
                  <p>Could not load supplier information</p>
                ) : (
                  <p>No supplier information available</p>
                )}
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-bold text-lg mb-3 text-[#1a5353]'>
              Line Items
            </h3>
            {lineItems.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-[#1a5353] text-white'>
                      <th className='p-2 text-left'>Product ID</th>
                      <th className='p-2 text-center'>Quantity</th>
                      <th className='p-2 text-center'>Free Qty</th>
                      <th className='p-2 text-right'>Unit Price (Rs)</th>
                      <th className='p-2 text-right'>Discount (Rs)</th>
                      <th className='p-2 text-right'>Total (Rs)</th>
                      <th className='p-2 text-center'>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className='p-2'>{item.productId || 'N/A'}</td>
                        <td className='p-2 text-center'>
                          {item.quantity || '0'}
                        </td>
                        <td className='p-2 text-center'>
                          {item.freeQuantity || '0'}
                        </td>
                        <td className='p-2 text-right'>
                          {parseFloat(item.unitPrice || 0).toFixed(2)}
                        </td>
                        <td className='p-2 text-right'>
                          {parseFloat(item.discountAmount || 0).toFixed(2)}
                        </td>
                        <td className='p-2 text-right'>
                          {parseFloat(item.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className='p-2 text-center'>
                          {item.expiryDate
                            ? formatDate(item.expiryDate)
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    <tr className='bg-[#e6eef3] font-semibold'>
                      <td colSpan='4' className='p-2 text-right'>
                        Total:
                      </td>
                      <td className='p-2 text-right'>
                        {parseFloat(invoice.discountAmount || 0).toFixed(2)}
                      </td>
                      <td className='p-2 text-right'>
                        {parseFloat(invoice.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className='p-2'></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='py-4 text-center text-gray-600'>
                <p>No line items available for this invoice</p>
              </div>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className='mt-6 pt-4 border-t flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b] transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

PurchaseInvoiceDetailsModal.propTypes = {
  invoice: PropTypes.shape({
    invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    invoiceNo: PropTypes.string,
    invoiceDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
    invoiceStatus: PropTypes.string,
    paymentType: PropTypes.string,
    totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    discountAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    netAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supplierId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    supplier_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchaseOrderRef: PropTypes.string,
    lineItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        freeQuantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        unitPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        totalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        discountAmount: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        manufactureDate: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array,
        ]),
        expiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        retailPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    ),
    purchaseLineItems: PropTypes.array, // Alternative field name for lineItems
  }),
  onClose: PropTypes.func.isRequired,
};

export default PurchaseInvoiceDetailsModal;
