import { useState } from 'react';
import './AddSuppliersForm.css';
import PropTypes from 'prop-types';

const AddSuppliersForm = ({ onClose, onAddSupplier }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierId: '',
    contactNumber: '',
    address: '',
    email: '',
    dateOfConnected: '',
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
    if (
      !formData.supplierName ||
      !formData.supplierId ||
      !formData.contactNumber
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors
    setSuccessMessage('Supplier added successfully!');

    // Pass the new product data to the parent
    if (onAddSupplier) {
      onAddSupplier(formData);
    }

    // Clear the form after a delay
    setTimeout(() => {
      setFormData({
        supplierName: '',
        supplierId: '',
        contactNumber: '',
        address: '',
        email: '',
        dateOfConnected: '',
      });
      setSuccessMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className='add-supplier-form'>
      <h2>Add Suppliers</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='supplierName'>Supplier Name:</label>
        <input
          type='text'
          id='supplierName'
          name='supplierName'
          value={formData.supplierName}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='supplierId'>Supplier ID:</label>
        <input
          type='text'
          id='supplierId'
          name='supplierId'
          value={formData.supplierId}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='contactNumber'>Contact Number:</label>
        <input
          type='text'
          id='contactNumber'
          name='contactNumber'
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='address'>Address:</label>
        <input
          type='text'
          id='address'
          name='address'
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='dateOfConnected'>Date of Connected:</label>
        <input
          type='date'
          id='dateOfConnected'
          name='dateOfConnected'
          value={formData.dateOfConnected}
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

AddSuppliersForm.propTypes = {
  onClose: PropTypes.func.isRequired, // Assuming onClose is a function
  onAddSupplier: PropTypes.func.isRequired,
};

export default AddSuppliersForm;
