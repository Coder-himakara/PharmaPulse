import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddProductsForm = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    batchId: '',
    category: '',
    supplierId: '',
    currentStock: '',
    expireDate: '',
    unitPrice: '',
    wholesalePrice: '',
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.productName || !formData.productId || !formData.category) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors
    setSuccessMessage('Product added successfully!');

    // Pass the new product data to the parent
    if (onAddProduct) {
      onAddProduct(formData);
    }

    // Clear the form after a delay
    setTimeout(() => {
      setFormData({
        productName: '',
        productId: '',
        batchId: '',
        category: '',
        supplierId: '',
        currentStock: '',
        expireDate: '',
        unitPrice: '',
        wholesalePrice: '',
      });
      setSuccessMessage('');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/sidebar');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Add Products
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
        <label
          htmlFor='productName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Product Name:
        </label>
        <input
          type='text'
          id='productName'
          name='productName'
          value={formData.productName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='productId' className='text-[16px] text-gray-800 w-2/3'>
          Product ID:
        </label>
        <input
          type='text'
          id='productId'
          name='productId'
          value={formData.productId}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='batchId' className='text-[16px] text-gray-800 w-2/3'>
          Batch ID:
        </label>
        <input
          type='text'
          id='batchId'
          name='batchId'
          value={formData.batchId}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='category' className='text-[16px] text-gray-800 w-2/3'>
          Category:
        </label>
        <select
          id='category'
          name='category'
          value={formData.category}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a category</option>
          <option value='Tablet'>Tablet</option>
          <option value='Syrup'>Syrup</option>
        </select>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='supplierId' className='text-[16px] text-gray-800 w-2/3'>
          Supplier ID:
        </label>
        <select
          id='supplierId'
          name='supplierId'
          value={formData.supplierId}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a supplier</option>
          <option value='S001'>S001</option>
          <option value='S002'>S002</option>
        </select>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='currentStock'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Current Stock:
        </label>
        <input
          type='number'
          id='currentStock'
          name='currentStock'
          value={formData.currentStock}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='expireDate' className='text-[16px] text-gray-800 w-2/3'>
          Expire Date:
        </label>
        <input
          type='date'
          id='expireDate'
          name='expireDate'
          value={formData.expireDate}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-800'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='unitPrice' className='text-[16px] text-gray-800 w-2/3'>
          Unit Price (Rs.):
        </label>
        <input
          type='number'
          id='unitPrice'
          name='unitPrice'
          value={formData.unitPrice}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='wholesalePrice'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Wholesale Price (Rs.):
        </label>
        <input
          type='number'
          id='wholesalePrice'
          name='wholesalePrice'
          value={formData.wholesalePrice}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-red-500 rounded-md text-sm'
        />
      </div>

      <div className='flex justify-center gap-2 mt-5'>
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

AddProductsForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductsForm;
