import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddCustomerGroupForm = ({ onAddCustomerGroup }) => {
  const [formData, setFormData] = useState({
    customerGroupName: '',
    assignSalesRepId: '',
    assignSalesRepName: '',
    location: '',
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

    if (!formData.customerGroupName) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Customer group added successfully!');

    if (onAddCustomerGroup) {
      onAddCustomerGroup(formData);
    }

    setTimeout(() => {
      setFormData({
        customerGroupName: '',
        assignSalesRepId: '',
        assignSalesRepName: '',
        location: '',
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
      className='flex flex-col max-w-lg mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Add Customer Group
      </h2>

      {errorMessage && <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>}
      {successMessage && <p className='text-[#3c5f3c] text-sm font-bold mb-4'>{successMessage}</p>}

      <div className='flex items-center gap-4 mb-4'>
        <label htmlFor='customerGroupName' className='text-[16px] text-gray-800 whitespace-nowrap'>
          Customer Group Name:
        </label>
        <input
          type='text'
          id='customerGroupName'
          name='customerGroupName'
          value={formData.customerGroupName}
          onChange={handleChange}
          className='flex-grow px-2 py-2 text-sm border border-gray-300 rounded-md'
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

AddCustomerGroupForm.propTypes = {
  onAddCustomerGroup: PropTypes.func.isRequired,
};

export default AddCustomerGroupForm;
