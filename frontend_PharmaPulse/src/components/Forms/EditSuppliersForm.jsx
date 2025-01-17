import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Forms.css';
import { useNavigate, useLocation } from 'react-router-dom';

const EditSuppliersForm = ({ onUpdateSupplier }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const supplier = state?.supplier; // Get supplier from the state

  const [formData, setFormData] = useState({
    supplierName: '',
    supplierId: '',
    contactNumber: '',
    address: '',
    email: '',
    dateOfConnected: '',
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName,
        supplierId: supplier.supplierId,
        contactNumber: supplier.contactNumber,
        address: supplier.address,
        email: supplier.email,
        dateOfConnected: supplier.dateOfConnected,
      });
    }
  }, [supplier]);

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

    // Pass the updated supplier data to the parent
    if (onUpdateSupplier) {
      onUpdateSupplier(formData);
    }

    setSuccessMessage('Supplier updated successfully!');

    // Clear the form and success message after a delay
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/suppliers-info');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/suppliers-info');
  };

  return (
    <form onSubmit={handleSubmit} className='add-item-form'>
      <h2>Edit Supplier</h2>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <p className='success-message'>{successMessage}</p>}

      <div className='form-group'>
        <label htmlFor='supplierName'>Supplier Name:</label>
        <input
          type='text'
          id='supplierName'
          name='supplierName'
          value={formData.supplierName}
          readOnly
        />
      </div>

      <div className='form-group'>
        <label htmlFor='supplierId'>Supplier ID:</label>
        <input
          type='text'
          id='supplierId'
          name='supplierId'
          value={formData.supplierId}
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

EditSuppliersForm.propTypes = {
  supplier: PropTypes.object.isRequired,
  onUpdateSupplier: PropTypes.func.isRequired,
};

export default EditSuppliersForm;
