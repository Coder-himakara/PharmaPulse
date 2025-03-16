import { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../../api/ApiClient'; // API client with baseURL configured

const SaleInvoiceCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use orderId from location.state if available
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [salesInvoice, setSalesInvoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to check if an invoice for this order already exists
  const checkInvoiceExists = async (orderId) => {
    try {
      const response = await apiClient.get('/sales-invoices');
      const invoices = response.data.data || response.data;
      return invoices.find((inv) => inv.orderId === Number(orderId));
    } catch (error) {
      console.error('Error checking existing invoice', error);
      return null;
    }
  };

  // Handler to create Sales Invoice using the provided Order ID
  const handleCreateInvoice = async () => {
    if (!orderId) {
      setErrorMessage('Please provide an Order ID');
      return;
    }
    setLoading(true);
    // First, check if an invoice for this order already exists
    const existingInvoice = await checkInvoiceExists(orderId);
    if (existingInvoice) {
      setSalesInvoice(existingInvoice);
      setInfoMessage('Invoice already exists for this order.');
      setLoading(false);
      return;
    }
    // Otherwise, create a new invoice
    try {
      const response = await apiClient.post('/sales-invoices', {
        orderId: Number(orderId),
      });
      const invoice = response.data.data || response.data;
      setSalesInvoice(invoice);
      setInfoMessage('Invoice created successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Invoice creation failed', error);
      setErrorMessage(
        error.response?.data?.message || 'Invoice creation failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300'>
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md mb-5 text-lg'>
        Create Sales Invoice
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4 text-center'>
          {errorMessage}
        </p>
      )}

      {infoMessage && (
        <p className='text-blue-600 text-sm font-bold mb-4 text-center'>
          {infoMessage}
        </p>
      )}

      {/* Show form to enter Order ID and create invoice if not yet created */}
      {!salesInvoice && (
        <div className='mb-6'>
          <label
            htmlFor='orderId'
            className='block text-gray-800 text-[16px] mb-2'
          >
            Order ID:
          </label>
          <input
            type='number'
            id='orderId'
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className='w-full px-2 py-2 border border-gray-300 rounded-md'
          />
          <button
            type='button'
            onClick={handleCreateInvoice}
            disabled={loading}
            className='mt-4 px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] hover:bg-[#00796b]'
          >
            {loading ? 'Checking/Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      )}

      {/* If invoice created, display invoice details */}
      {salesInvoice && (
        <div>
          <h3 className='text-xl font-bold mb-4'>Invoice Details</h3>
          <table className='w-full border-collapse mb-4'>
            <tbody>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Invoice No:</td>
                <td className='p-2'>{salesInvoice.invoiceNo}</td>
              </tr>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Invoice Date:</td>
                <td className='p-2'>
                  {new Date(salesInvoice.invoiceDate).toLocaleString()}
                </td>
              </tr>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Order ID:</td>
                <td className='p-2'>{salesInvoice.orderId}</td>
              </tr>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Customer Name:</td>
                <td className='p-2'>{salesInvoice.customerName}</td>
              </tr>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Total Amount:</td>
                <td className='p-2'>
                  {'$' + parseFloat(salesInvoice.totalAmount).toFixed(2)}
                </td>
              </tr>
              <tr className='border-b'>
                <td className='p-2 font-bold'>Discount Amount:</td>
                <td className='p-2'>
                  {'$' + parseFloat(salesInvoice.discountAmount).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className='text-xl font-bold mb-2'>Invoice Items</h3>
          <table className='w-full border-collapse mb-4'>
            <thead>
              <tr className='bg-[#ffb24d] text-[#5e5757] text-sm'>
                <th className='border p-2'>Product Name</th>
                <th className='border p-2'>Quantity</th>
                <th className='border p-2'>Unit Price</th>
                <th className='border p-2'>Discount</th>
                <th className='border p-2'>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {salesInvoice.invoiceItems.map((item, idx) => (
                <tr key={idx} className='text-center text-sm'>
                  <td className='border p-2'>{item.productName}</td>
                  <td className='border p-2'>{item.quantity}</td>
                  <td className='border p-2'>
                    {'$' + parseFloat(item.unitPrice).toFixed(2)}
                  </td>
                  <td className='border p-2'>
                    {'$' + parseFloat(item.discount).toFixed(2)}
                  </td>
                  <td className='border p-2'>
                    {'$' + parseFloat(item.lineTotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='mt-4'>
        <button
          type='button'
          onClick={() => navigate('/orders')}
          className='px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]'
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default SaleInvoiceCreateForm;
