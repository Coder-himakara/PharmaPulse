import { useState } from 'react';
import './AddCustomersForm.css';
import PropTypes from 'prop-types';

const AddCustomersForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
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
      !formData.customerName ||
      !formData.customerId ||
      !formData.contactNumber
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors
    setSuccessMessage('Customer added successfully!');

    console.log('Customer added:', formData);

    // Clear the form after a delay
    setTimeout(() => {
      setFormData({
        customerName: '',
        customerId: '',
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
    <form onSubmit={handleSubmit} className='add-customer-form'>
      <h2>Add Customers</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='customerName'>Customer Name:</label>
        <input
          type='text'
          id='customerName'
          name='customerName'
          value={formData.customerName}
          onChange={handleChange}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='customerId'>Customer ID:</label>
        <input
          type='text'
          id='customerId'
          name='customerId'
          value={formData.customerId}
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

AddCustomersForm.propTypes = {
  onClose: PropTypes.func.isRequired, // This ensures onClose is a function and is required
};

export default AddCustomersForm;
