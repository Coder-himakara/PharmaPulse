import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Forms.css';

const EditCustomersForm = ({ customer, onClose, onUpdateCustomer }) => {
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

  useEffect(() => {
    if (customer) {
      setFormData({
        customerName: customer.customerName,
        customerId: customer.customerId,
        contactNumber: customer.contactNumber,
        address: customer.address,
        email: customer.email,
        dateOfConnected: customer.dateOfConnected,
      });
    }
  }, [customer]);

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
    if (!formData.email || !formData.address || !formData.contactNumber) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors

    // Pass the updated customer data to the parent
    if (onUpdateCustomer) {
      onUpdateCustomer(formData);
    }

    setSuccessMessage('Customer updated successfully!');

    // Clear the form and success message after a delay
    setTimeout(() => {
      setSuccessMessage('');
      if (onClose) onClose();
    }, 30000);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className='add-item-form'>
      <h2>Edit Customer</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='customerName'>Customer Name:</label>
        <input
          type='text'
          id='customerName'
          name='customerName'
          value={formData.customerName}
          readOnly
        />
      </div>

      <div className='form-group'>
        <label htmlFor='customerId'>Customer ID:</label>
        <input
          type='text'
          id='customerId'
          name='customerId'
          value={formData.customerId}
          readOnly
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
          readOnly
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

EditCustomersForm.propTypes = {
  customer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateCustomer: PropTypes.func.isRequired,
};

export default EditCustomersForm;
