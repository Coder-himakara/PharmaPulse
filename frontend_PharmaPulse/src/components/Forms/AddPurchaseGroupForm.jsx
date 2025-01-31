/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddPurchaseGroupForm = ({ onAddPurchaseGroups }) => {
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

  const handleChange = (pg) => {
    const { name, value } = pg.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = (pg) => {
    pg.preventDefault();

    // Check if any required field is empty
    if (
      !formData.purchaseGroupId ||
      !formData.purchaseGroupName.trim() ||
      !formData.address.trim() ||
      !formData.contactName.trim() ||
      !formData.telePhoneNo.trim() ||
      !formData.email.trim() ||
      !formData.supplierId.trim()
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // Clear error message and show success
    setErrorMessage('');
    setSuccessMessage('Purchase Group Added Successfully!');

    // Save the new purchase group to localStorage
    const savedPurchaseGroups = JSON.parse(localStorage.getItem('purchaseGroups')) || [];
    const updatedPurchaseGroups = [...savedPurchaseGroups, formData];
    localStorage.setItem('purchaseGroups', JSON.stringify(updatedPurchaseGroups));

    // Pass the data to the parent component
    onAddPurchaseGroups(formData);

    // Show success message for a short period
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/purchase-group-info');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'>
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Add Purchase Group
      </h2>

      {errorMessage && <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>}
      {successMessage && <p className='text-[#3c5f3c] text-sm font-bold mb-4'>{successMessage}</p>}

      {[ // Form Fields Mapping
        { label: 'Purchase Group Id', name: 'purchaseGroupId' },
        { label: 'Purchase Group Name', name: 'purchaseGroupName' },
        { label: 'Address', name: 'address' },
        { label: 'Contact Name', name: 'contactName' },
        { label: 'Telephone No', name: 'telePhoneNo' },
        { label: 'Email', name: 'email' },
        { label: 'Supplier Id', name: 'supplierId' },
      ].map(({ label, name }) => (
        <div className='flex items-center mb-4' key={name}>
          <label htmlFor={name} className='text-[16px] text-gray-800 font-medium w-1/3 text-left'>
            {label}:
          </label>
          <input
            type='text'
            id={name}
            name={name}  // Ensure formData property matches with name
            value={formData[name]}  // Ensures input value corresponds to state
            onChange={handleChange}
            className='w-2/3 px-3 py-2 text-sm border border-gray-300 rounded-md'
          />
        </div>
      ))}

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
  onAddPurchaseGroups: PropTypes.func.isRequired,
};

export default AddPurchaseGroupForm;
