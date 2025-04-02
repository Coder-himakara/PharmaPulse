import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { addPurchaseGroups } from '../../../../../api/EmployeeApiService';

const AddPurchaseGroupForm = ({ onAddPurchaseGroup }) => {
  const [formData, setFormData] = useState({
    purchaseGroupName: '',
    purchaseGroupAddress: '',
    purchaseGroupContactName: '',
    purchaseGroupPhoneNo: '',
    purchaseGroupFaxNo: '',
    purchaseGroupEmail: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (fax is optional)
    const requiredFields = {
      purchaseGroupName: 'Purchase Group Name',
      purchaseGroupAddress: 'Address',
      purchaseGroupContactName: 'Contact Name',
      purchaseGroupPhoneNo: 'Phone Number',
      purchaseGroupEmail: 'Email',
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key] || formData[key].trim() === '') {
        setErrorMessage(`${label} is required.`);
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.purchaseGroupEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      console.log('Sending:', formData);
      const response = await addPurchaseGroups(formData);
      const savedPurchaseGroup = response.data.data;
      setErrorMessage('');
      setSuccessMessage('Purchase Group Added Successfully!');

      if (onAddPurchaseGroup) {
        onAddPurchaseGroup(savedPurchaseGroup);
      }

      setTimeout(() => {
        setFormData({
          purchaseGroupName: '',
          purchaseGroupAddress: '',
          purchaseGroupContactName: '',
          purchaseGroupPhoneNo: '',
          purchaseGroupFaxNo: '',
          purchaseGroupEmail: '',
        });
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.message || 'Failed to add purchase group';
      setErrorMessage(serverMessage);
      console.error('Error details:', error.response || error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCancel = () => {
    navigate('/employee-dashboard');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
        Add Purchase Group
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4 text-center'>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4 text-center'>
          {successMessage}
        </p>
      )}

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupName'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Purchase Group Name:
        </label>
        <input
          type='text'
          id='purchaseGroupName'
          name='purchaseGroupName'
          value={formData.purchaseGroupName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupAddress'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Address:
        </label>
        <input
          type='text'
          id='purchaseGroupAddress'
          name='purchaseGroupAddress'
          value={formData.purchaseGroupAddress}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupContactName'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Contact Name:
        </label>
        <input
          type='text'
          id='purchaseGroupContactName'
          name='purchaseGroupContactName'
          value={formData.purchaseGroupContactName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupPhoneNo'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Phone Number:
        </label>
        <input
          type='text' // Changed from 'number' to 'text' to match String expectation
          id='purchaseGroupPhoneNo'
          name='purchaseGroupPhoneNo'
          value={formData.purchaseGroupPhoneNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupFaxNo'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Fax:
        </label>
        <input
          type='text'
          id='purchaseGroupFaxNo'
          name='purchaseGroupFaxNo'
          value={formData.purchaseGroupFaxNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupEmail'
          className='text-[16px] text-gray-800 w-2/3 text-left'
        >
          Email:
        </label>
        <input
          type='email'
          id='purchaseGroupEmail'
          name='purchaseGroupEmail'
          value={formData.purchaseGroupEmail}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex justify-center gap-2'>
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

AddPurchaseGroupForm.propTypes = {
  onAddPurchaseGroup: PropTypes.func.isRequired,
};

export default AddPurchaseGroupForm;