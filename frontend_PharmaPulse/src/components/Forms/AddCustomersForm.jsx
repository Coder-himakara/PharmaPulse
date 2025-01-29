import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddCustomersForm = ({ onAddCustomer }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    contactNumber: '',
    address: '',
    email: '',
    dateOfConnected: '',
    batchName: '',
    time: '',
    age: '',
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
    if (
      !formData.customerName ||
      !formData.customerId ||
      !formData.contactNumber ||
      !formData.batchName ||
      !formData.time ||
      !formData.age
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage(''); // Clear errors
    setSuccessMessage('Customer added successfully!');

    // Pass the new customer data to the parent
    if (onAddCustomer) {
      onAddCustomer(formData);
    }

    // Clear the form after a delay
    setTimeout(() => {
      setFormData({
        customerName: '',
        customerId: '',
        contactNumber: '',
        address: '',
        email: '',
        dateOfConnected: '',
        batchName: '',
        time: '',
        age: '',
      });
      setSuccessMessage('');
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
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Add Customers
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4'>
          {successMessage}
        </p>
      )}

      {/* Customer Name Field */}
      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='customerName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Customer Name:
        </label>
        <input
          type='text'
          id='customerName'
          name='customerName'
          value={formData.customerName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Customer ID Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='customerId' className='text-[16px] text-gray-800 w-2/3'>
          Customer ID:
        </label>
        <input
          type='text'
          id='customerId'
          name='customerId'
          value={formData.customerId}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Contact Number Field */}
      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='contactNumber'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Contact Number:
        </label>
        <input
          type='text'
          id='contactNumber'
          name='contactNumber'
          value={formData.contactNumber}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Address Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='address' className='text-[16px] text-gray-800 w-2/3'>
          Address:
        </label>
        <input
          type='text'
          id='address'
          name='address'
          value={formData.address}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Email Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='email' className='text-[16px] text-gray-800 w-2/3'>
          Email:
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Date of Connected Field */}
      <div className='flex justify-between items-center mb-4'>
        <label
          htmlFor='dateOfConnected'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Date of Connected:
        </label>
        <input
          type='date'
          id='dateOfConnected'
          name='dateOfConnected'
          value={formData.dateOfConnected}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-800'
        />
      </div>

      {/* Batch Name Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='batchName' className='text-[16px] text-gray-800 w-2/3'>
          Batch Name:
        </label>
        <input
          type='text'
          id='batchName'
          name='batchName'
          value={formData.batchName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Time Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='time' className='text-[16px] text-gray-800 w-2/3'>
          Time:
        </label>
        <input
          type='text'
          id='time'
          name='time'
          value={formData.time}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      {/* Age Field */}
      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='age' className='text-[16px] text-gray-800 w-2/3'>
          Age:
        </label>
        <input
          type='number'
          id='age'
          name='age'
          value={formData.age}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
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

AddCustomersForm.propTypes = {
  onAddCustomer: PropTypes.func.isRequired,
};

export default AddCustomersForm;
