/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useNavigate, useLocation } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const EditCustomerGroupForm = ({ onUpdateCustomerGroups }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const customerGroups = state?.customerGroups; // Get customer group from the state

  const [formData, setFormData] = useState({
    customerGroupName: '',
    assignSalesRepId: '',
    assignSalesRepName: '',
    location: '',
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (customerGroups) {
      setFormData({
        customerGroupName: customerGroups.customerGroupName,
        assignSalesRepId: customerGroups.assignSalesRepId,
        assignSalesRepName: customerGroups.assignSalesRepName,
        location: customerGroups.address,
      });
    }
  }, [customerGroups]);

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
      !formData.assignSalesRepId ||
      !formData.assignSalesRepName ||
      !formData.customerGroupName ||
      !formData.location
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors

    // Pass the updated customer data to the parent
    if (onUpdateCustomerGroups) {
      onUpdateCustomerGroups(formData);
    }

    setSuccessMessage('Customer Group updated successfully!');

    // Clear the form and success message after a delay
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/customer-group-info');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/customer-group-info');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Edit Customer Group
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4'>
          {successMessage}
        </p>
      )}

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='customerName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Customer Group Name:
        </label>
        <input
          type='text'
          id='customerGroupName'
          name='customerGroupName'
          value={formData.customerGroupName}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          readOnly
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='assignSalesRepId' className='text-[16px] text-gray-800'>
          Sales Rep:
        </label>
        <div className='flex w-2/3 gap-2'>
          <input
            type='text'
            id='assignSalesRepId'
            name='assignSalesRepId'
            placeholder='ID'
            value={formData.assignSalesRepId}
            onChange={handleChange}
            className='w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          />
          <input
            type='text'
            id='assignSalesRepName'
            name='assignSalesRepName'
            placeholder='Name'
            value={formData.assignSalesRepName}
            onChange={handleChange}
            className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          />
        </div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='location' className='text-[16px] text-gray-800'>
          Location:
        </label>
        <input
          type='text'
          id='location'
          name='location'
          value={formData.location}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-center gap-2 mt-5'>
        <button
          type='submit'
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
        >
          Update
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

EditCustomerGroupForm.propTypes = {
  customer: PropTypes.object.isRequired,
  onUpdateCustomer: PropTypes.func.isRequired,
};

export default EditCustomerGroupForm;
