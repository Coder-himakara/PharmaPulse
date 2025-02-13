import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddPurchaseInvoiceForm = ({ onAddPurchaseInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    purchaseNo: '',
    supplierId: '',
    purchaseOrderRef: '',
    purchaseInvoiceId: '',
    invoiceStatus: '',
    invoiceDate: '',
    invoiceNo: '',
    paymentType: '',
    totalAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    lineItems: [{ product: '', quantity: '', price: '' }],
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      (sum, item) => sum + item.quantity * item.price,
      0,
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
        { product: '', quantity: '', price: '' },
      ],
    });
  };

  // Remove unusable line item
  const removeLineItem = (indexToRemove) => {
    if (window.confirm('Are you sure you want to remove this line item?')) {
      const updatedLineItems = invoiceData.lineItems.filter(
        (_, index) => index !== indexToRemove,
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
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Purchase Invoice added successfully!');

    if (onAddPurchaseInvoice) {
      onAddPurchaseInvoice(invoiceData);
    }

    setTimeout(() => {
      setInvoiceData({
        purchaseNo: '',
        supplierId: '',
        purchaseOrderRef: '',
        purchaseInvoiceId: '',
        invoiceStatus: '',
        invoiceDate: '',
        invoiceNo: '',
        paymentType: '',
        totalAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        lineItems: [{ product: '', quantity: '', price: '' }],
      });
      setSuccessMessage('');
      //navigate("/purchase-invoice-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
        Add Purchase Invoice
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4'>
          {successMessage}
        </p>
      )}

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='purchaseNo' className='text-[16px] text-gray-800 w-2/3'>
          Purchase Number
        </label>
        <input
          type='number'
          name='purchaseNo'
          value={invoiceData.purchaseNo}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='supplierId' className='text-[16px] text-gray-800 w-2/3'>
          Supplier ID
        </label>
        <select
          id='supplierId'
          name='supplierId'
          value={invoiceData.supplierId}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a supplier</option>
          <option value='S001'>S001</option>
          <option value='S002'>S002</option>
        </select>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='purchaseOrderRef'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Purchase Order Reference
        </label>
        <input
          type='text'
          name='purchaseOrderRef'
          value={invoiceData.purchaseOrderRef}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='purchaseInvoiceId'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Purchase Invoice ID
        </label>
        <input
          type='long'
          name='purchaseInvoiceId'
          value={invoiceData.purchaseInvoiceId}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='invoiceStatus'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Invoice Status
        </label>
        <select
          id='invoiceStatus'
          name='invoiceStatus'
          value={invoiceData.invoiceStatus}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a status</option>
          <option value='PAID'>Paid</option>
          <option value='DRAFT'>Draft</option>
          <option value='ACTIVE'>Active</option>
          <option value='CANCELLED'>Cancelled</option>
        </select>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='invoiceDate'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Invoice Date
        </label>
        <input
          type='date'
          name='invoiceDate'
          value={invoiceData.invoiceDate}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='invoiceNo' className='text-[16px] text-gray-800 w-2/3'>
          Invoice Number
        </label>
        <input
          type='number'
          name='invoiceNo'
          value={invoiceData.invoiceNo}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='paymentType'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Payment Type
        </label>
        <select
          id='paymentType'
          name='paymentType'
          value={invoiceData.paymentType}
          onChange={handleInputChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a payment type</option>
          <option value='CASH'>Cash</option>
          <option value='CREDIT'>Credit</option>
          <option value='CHEQUE'>Cheque</option>
        </select>
      </div>

      <div className='mb-4'>
        <label htmlFor='lineItems' className='text-[16px] text-gray-800 w-2/3'>
          Line Items
        </label>

        {invoiceData.lineItems.map((item, index) => (
          <div key={index} className='flex items-center gap-2 mb-2'>
            <input
              type='text'
              placeholder='Product'
              value={item.product}
              onChange={(e) =>
                handleLineItemChange(index, 'product', e.target.value)
              }
              className='w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
            />
            <input
              type='number'
              placeholder='Quantity'
              value={item.quantity}
              onChange={(e) =>
                handleLineItemChange(
                  index,
                  'quantity',
                  parseInt(e.target.value),
                )
              }
              className='w-1/3 px-2 py-2 border border-red-500 rounded-md text-sm'
              min='1'
            />
            <input
              type='number'
              placeholder='Price'
              value={item.price}
              onChange={(e) =>
                handleLineItemChange(index, 'price', parseFloat(e.target.value))
              }
              className='w-1/3 px-2 py-2 border border-red-500 rounded-md text-sm'
              min='0'
            />
            <button
              type='button'
              onClick={() => removeLineItem(index)}
              className='bg-[#4c85a6] text-white py-1 px-2 rounded-md text-sm hover:bg-[#15375c]'
            >
              X
            </button>
          </div>
        ))}
        <div className='mt-2'>
          <button
            type='button'
            onClick={addLineItem}
            className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]'
          >
            Add Line Item
          </button>
        </div>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='discountAmount'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Discount Amount
        </label>
        <input
          type='number'
          name='discountAmount'
          value={invoiceData.discountAmount}
          onChange={(e) => handleInputChange(e)}
          onBlur={calculateTotals}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
          min='0'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <strong>Total Amount: </strong> {invoiceData.totalAmount.toFixed(2)}
      </div>

      <div className='flex justify-between items-center mb-4'>
        <strong>Net Amount: </strong> {invoiceData.netAmount.toFixed(2)}
      </div>

      <div className='flex justify-center gap-2'>
        <button
          type='submit'
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
        >
          Add
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
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
