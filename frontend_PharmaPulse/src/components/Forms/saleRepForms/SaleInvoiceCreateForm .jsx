import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../../api/ApiClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SaleInvoiceCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pdfRef = useRef(); // Ref for PDF content capture

  // State hooks
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [salesInvoice, setSalesInvoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Format order/invoice date
  const formatOrderDate = (orderDate) => {
    if (Array.isArray(orderDate)) {
      const [year, month, day, hours, minutes] = orderDate;
      return new Date(year, month - 1, day, hours, minutes).toLocaleString();
    }
    return new Date(orderDate).toLocaleString();
  };

  // Check if an invoice for the given order already exists
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

  // Generate PDF function
  const generatePDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${salesInvoice.invoiceNo}_${Date.now()}.pdf`);
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

      {/* If invoice created, display invoice details and provide PDF download option */}
      {salesInvoice && (
        <div>
          {/* PDF content wrapper */}
          <div ref={pdfRef} className='bg-white p-5 rounded-lg mb-4'>
            {/* Company Header */}
            <div className='text-center mb-6'>
              <h1 className='text-2xl font-bold text-[#1a5353]'>PharmaPulse</h1>
              <p className='text-sm text-gray-600'>123 Medical Street</p>
              <p className='text-sm text-gray-600'>Colombo, Sri Lanka</p>
              <p className='text-sm text-gray-600'>Tel: +94 112 345 678</p>
            </div>

            <h3 className='text-xl font-bold mb-4 text-center'>INVOICE</h3>

            {/* Invoice Details */}
            <div className='flex justify-between mb-6'>
              <div>
                <p className='font-semibold'>
                  Customer: {salesInvoice.customerName}
                </p>
                <p>Invoice Date: {formatOrderDate(salesInvoice.invoiceDate)}</p>
                <p>Invoice No: {salesInvoice.invoiceNo}</p>
              </div>
              <div>
                <p>Order ID: {salesInvoice.orderId}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className='w-full border-collapse mb-6'>
              <thead>
                <tr className='bg-[#1a5353] text-white'>
                  <th className='p-2 text-left'>Product</th>
                  <th className='p-2 text-center'>Qty</th>
                  <th className='p-2 text-right'>Unit Price</th>
                  <th className='p-2 text-right'>Discount</th>
                  <th className='p-2 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {salesInvoice.invoiceItems.map((item, idx) => (
                  <tr key={idx} className='border-b'>
                    <td className='p-2'>{item.productName}</td>
                    <td className='p-2 text-center'>{item.quantity}</td>
                    <td className='p-2 text-right'>
                      {parseFloat(item.unitPrice).toFixed(2)}
                    </td>
                    <td className='p-2 text-right'>
                      {parseFloat(item.discount).toFixed(2)}
                    </td>
                    <td className='p-2 text-right'>
                      {parseFloat(item.lineTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className='flex justify-end'>
              <div className='w-1/3'>
                <div className='flex justify-between mb-2'>
                  <span className='font-semibold'>Subtotal:</span>
                  <span>
                    Rs{' '}
                    {parseFloat(
                      salesInvoice.totalAmount + salesInvoice.discountAmount,
                    ).toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='font-semibold'>Discount:</span>
                  <span>
                    Rs {parseFloat(salesInvoice.discountAmount).toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between mb-2 border-t pt-2'>
                  <span className='font-semibold'>Total:</span>
                  <span className='font-bold'>
                    Rs {parseFloat(salesInvoice.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='mt-8 text-center text-sm text-gray-600'>
              <p>Thank you for your business!</p>
              <p>
                This is a computer generated invoice and does not require a
                signature
              </p>
            </div>
          </div>

          {/* Additional Invoice Details Table */}
          <div className='mb-6'>
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
                    {formatOrderDate(salesInvoice.invoiceDate)}
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
                  <td className='p-2 font-bold'>Total Amount (Rs):</td>
                  <td className='p-2'>
                    {parseFloat(salesInvoice.totalAmount).toFixed(2)}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 font-bold'>Discount Amount (Rs):</td>
                  <td className='p-2'>
                    {parseFloat(salesInvoice.discountAmount).toFixed(2)}
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
                  <th className='border p-2'>Unit Price (Rs)</th>
                  <th className='border p-2'>Discount (Rs)</th>
                  <th className='border p-2'>Line Total (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {salesInvoice.invoiceItems.map((item, idx) => (
                  <tr key={idx} className='text-center text-sm'>
                    <td className='border p-2'>{item.productName}</td>
                    <td className='border p-2'>{item.quantity}</td>
                    <td className='border p-2'>
                      {parseFloat(item.unitPrice).toFixed(2)}
                    </td>
                    <td className='border p-2'>
                      {parseFloat(item.discount).toFixed(2)}
                    </td>
                    <td className='border p-2'>
                      {parseFloat(item.lineTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className='mt-4 flex gap-4 justify-end'>
            <button
              onClick={generatePDF}
              className='px-5 py-2 bg-[#1a5353] text-white rounded-md hover:bg-[#0d3b3b] transition-colors'
            >
              Download PDF
            </button>
            <button
              onClick={() => navigate('/orders')}
              className='px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b] transition-colors'
            >
              Back to Orders
            </button>
          </div>
        </div>
      )}

      {/* Fallback Back Button (if invoice not created) */}
      {!salesInvoice && (
        <div className='mt-4'>
          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]'
          >
            Back to Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default SaleInvoiceCreateForm;
