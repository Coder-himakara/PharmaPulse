import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Forms.css';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProductsForm = ({ onUpdateProduct }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const product = state?.product; // Get product from the state

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

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        productId: product.productId,
        batchId: product.batchId,
        category: product.category,
        supplierId: product.supplierId,
        currentStock: product.currentStock,
        expireDate: product.expireDate,
        unitPrice: product.unitPrice,
        wholesalePrice: product.wholesalePrice,
      });
    }
  }, [product]);

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
    if (!formData) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors

    // Pass the updated product data to the parent
    if (onUpdateProduct) {
      onUpdateProduct(formData);
    }

    setSuccessMessage('Product updated successfully!');

    // Clear the form and success message after a delay
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/products-info');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/products-info');
  };

  return (
    <form onSubmit={handleSubmit} className='add-item-form'>
      <h2>Edit Product</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='productName'>Product Name:</label>
        <input
          type='text'
          id='productName'
          name='productName'
          value={formData.productName}
          readOnly
        />
      </div>

      <div className='form-group'>
        <label htmlFor='productId'>Product ID:</label>
        <input
          type='text'
          id='productId'
          name='productId'
          value={formData.productId}
          readOnly
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
        <button type='submit'>Update</button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

EditProductsForm.propTypes = {
  product: PropTypes.object.isRequired,
  onUpdateProduct: PropTypes.func.isRequired,
};

export default EditProductsForm;
