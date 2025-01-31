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

  const handleChange = (pg) => {
    const { name, value } = pg.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (pg) => {
    pg.preventDefault();
    if (!formData.email.trim() || !formData.purchaseGroupName.trim() || !formData.purchaseGroupId.trim() || !formData.supplierId.trim() || !formData.telePhoneNo.trim()) {

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
      
      {errorMessage && <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>}
      {successMessage && <p className='text-[#3c5f3c] text-sm font-bold mb-4'>{successMessage}</p>}

      {[
        { label: 'Purchase Group Id', name:'purchaseGroupId' },
        { label: 'Purchase Group Name', name:'purchaseGroupName' },  
        { label: 'Address', name:'address' },
        { label: 'Contact Name', name:'contactName' },
        { label: 'Email', name:'email' },
        { label: 'Supplier Id', name:'supplierId' },
      
      ].map(({ label, name }) => (
        <div className='flex items-center mb-4' key={name}>
          <label htmlFor={name} className='text-[16px] text-gray-800 font-medium w-1/3 text-left'>
            {label}:
          </label>
          <input
            type='text'
            id={name}
            name={name}  // Correctly match with formData property name
            value={formData[name]}  // Correctly match with formData state
            onChange={handleChange}
            className='w-2/3 px-3 py-2 text-sm border border-gray-300 rounded-md'
          />
        </div>
      ))}

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