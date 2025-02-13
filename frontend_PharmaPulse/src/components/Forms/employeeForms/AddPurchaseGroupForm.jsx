import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddPurchaseGroupForm = ({ onAddPurchaseGroup }) => {
  const [formData, setFormData] = useState({
    purchaseGroupName: '',
    address: '',
    contactName: '',
    phoneNo: '',
    email: '',
    fax: '',
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

  const handleSubmit = (pg) => {
    pg.preventDefault();

    if (
      !formData.purchaseGroupName.trim() ||
      !formData.address.trim() ||
      !formData.contactName.trim() ||
      !formData.phoneNo.trim() ||
      !formData.email.trim() ||
      !formData.fax.trim()
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Purchase Group Added Successfully!');

    if (onAddPurchaseGroup) {
      onAddPurchaseGroup(formData);
    }

    setTimeout(() => {
      setFormData({
        purchaseGroupName: '',
        address: '',
        contactName: '',
        phoneNo: '',
        email: '',
        fax: '',
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
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
        Add Purchase Group
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
          htmlFor='purchaseGroupName'
          className='text-[16px] text-gray-800 w-2/3'
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
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='address' className='text-[16px] text-gray-800 w-2/3'>
          Address:
        </label>
        <input
          type='text'
          id='address'
          name='address'
          value={formData.address}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='contactName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Contact Name:
        </label>
        <input
          type='text'
          id='contactName'
          name='contactName'
          value={formData.contactName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='phoneNo' className='text-[16px] text-gray-800 w-2/3'>
          Phone Number:
        </label>
        <input
          type='number'
          id='phoneNo'
          name='phoneNo'
          value={formData.phoneNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-red-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='email' className='text-[16px] text-gray-800 w-2/3'>
          Email:
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='fax' className='text-[16px] text-gray-800 w-2/3'>
          Fax:
        </label>
        <input
          id='fax'
          name='fax'
          value={formData.fax}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm text-gray-800 border border-gray-300 rounded-md'
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

AddPurchaseGroupForm.propTypes = {
  onAddPurchaseGroup: PropTypes.func.isRequired,
};

export default AddPurchaseGroupForm;
