import { useState } from 'react';
import './AddProductsForm.css';
import PropTypes from 'prop-types';

const AddProductsForm = ({ onClose, onAddProduct }) => {
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
    }, 3000);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className='add-product-form'>
      <h2>Add Products</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='productName'>Product Name:</label>
        <input
          type='text'
          id='productName'
          name='productName'
          value={formData.productName}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='productId'>Product ID:</label>
        <input
          type='text'
          id='productId'
          name='productId'
          value={formData.productId}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='batchId'>Batch ID:</label>
        <input
          type='text'
          id='batchId'
          name='batchId'
          value={formData.batchId}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='category'>Category:</label>
        <select
          id='category'
          name='category'
          value={formData.category}
          onChange={handleChange}
        >
          <option value=''>Choose a category</option>
          <option value='Tablet'>Tablet</option>
          <option value='Syrup'>Syrup</option>
        </select>
      </div>

      <div className='form-group'>
        <label htmlFor='supplierId'>Supplier ID:</label>
        <select
          id='supplierId'
          name='supplierId'
          value={formData.supplierId}
          onChange={handleChange}
        >
          <option value=''>Choose a supplier</option>
          <option value='S001'>S001</option>
          <option value='S002'>S002</option>
        </select>
      </div>

      <div className='form-group'>
        <label htmlFor='currentStock'>Current Stock:</label>
        <input
          type='number'
          id='currentStock'
          name='currentStock'
          value={formData.currentStock}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='expireDate'>Expire Date:</label>
        <input
          type='date'
          id='expireDate'
          name='expireDate'
          value={formData.expireDate}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='unitPrice'>Unit Price (Rs.):</label>
        <input
          type='number'
          id='unitPrice'
          name='unitPrice'
          value={formData.unitPrice}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='wholesalePrice'>Wholesale Price (Rs.):</label>
        <input
          type='number'
          id='wholesalePrice'
          name='wholesalePrice'
          value={formData.wholesalePrice}
          onChange={handleChange}
        />
      </div>

      <div className='button-container'>
        <button type='submit'>Add</button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

AddProductsForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductsForm;
