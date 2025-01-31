/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const EditPurchaseGroupForm = ({ onUpdatePurchaseGroups }) => {
  const { state } = useLocation();
  const purchaseGroups = state?.purchaseGroups;

  const [formData, setFormData] = useState({
    purchaseGroupId: '',
    purchaseGroupName: '',
    address: '',
    contactName: '',
    telePhoneNo: '',
    email: '',
    supplierId: '',
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (purchaseGroups) {
      setFormData({
        purchaseGroupId: purchaseGroups.purchaseGroupId,
        purchaseGroupName: purchaseGroups.purchaseGroupName,
        address: purchaseGroups.address,
        contactName: purchaseGroups.contactName,
        telePhoneNo: purchaseGroups.telePhoneNo,
        email: purchaseGroups.email,
        supplierId: purchaseGroups.supplierId,
      });
    }
  }, [purchaseGroups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.purchaseGroupId || !formData.purchaseGroupName || !formData.address || !formData.contactName || !formData.telePhoneNo || !formData.email || !formData.supplierId) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    setErrorMessage('');
    if (onUpdatePurchaseGroups) {
      onUpdatePurchaseGroups(formData);
    }
    setSuccessMessage('Purchase Group updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/purchase-group-info');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/purchase-group-info');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'>
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Edit Purchase Group
      </h2>
      {errorMessage && <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>}
      {successMessage && <p className='text-[#3c5f3c] text-sm font-bold mb-4'>{successMessage}</p>}
      <div className='mb-4'>
        <label htmlFor='purchaseGroupName' className='text-gray-800'>Purchase Group Name:</label>
        <input type='text' id='purchaseGroupName' name='purchaseGroupName' value={formData.purchaseGroupName} onChange={handleChange} className='w-full px-2 py-2 border border-gray-300 rounded-md' />
      </div>
      <div className='mb-4'>
        <label htmlFor='address' className='text-gray-800'>Address:</label>
        <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} className='w-full px-2 py-2 border border-gray-300 rounded-md' />
      </div>
      <div className='mb-4'>
        <label htmlFor='contactName' className='text-gray-800'>Contact Name:</label>
        <input type='text' id='contactName' name='contactName' value={formData.contactName} onChange={handleChange} className='w-full px-2 py-2 border border-gray-300 rounded-md' />
      </div>
      <div className='mb-4'>
        <label htmlFor='telePhoneNo' className='text-gray-800'>Telephone No:</label>
        <input type='text' id='telePhoneNo' name='telePhoneNo' value={formData.telePhoneNo} onChange={handleChange} className='w-full px-2 py-2 border border-gray-300 rounded-md' />
      </div>
      <div className='mb-4'>
        <label htmlFor='supplierId' className='text-gray-800'>Supplier ID:</label>
        <input type='text' id='supplierId' name='supplierId' value={formData.supplierId} onChange={handleChange} className='w-full px-2 py-2 border border-gray-300 rounded-md' />
      </div>
      <div className='mb-4'>
        <label htmlFor='email' className='text-gray-800'>Email:</label>
        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='w-full px-2 py-2 border border-red-500 rounded-md' />
      </div>
      <div className='flex justify-center gap-2 mt-5'>
        <button type='submit' className='px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b]'>Update</button>
        <button type='button' onClick={handleCancel} className='px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b]'>Cancel</button>
      </div>
    </form>
  );
};

EditPurchaseGroupForm.propTypes = {
  onUpdatePurchaseGroups: PropTypes.func.isRequired,
};

export default EditPurchaseGroupForm;