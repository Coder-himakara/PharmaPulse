/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddPurchaseGroupForm = ({ onAddPurchaseGroup }) => {
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
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value.trim(),
      };
      console.log(updatedData); // Log form data to check if it's being updated
      return updatedData;
    });
  };
  

  const handleSubmit = (pg) => {
    pg.preventDefault();
    console.log(formData); // Add this line to inspect the formData
    if (!formData.purchaseGroupId|| !formData.purchaseGroupName.trim() ||!formData.address||!formData.contactName.trim()||!formData.telePhoneNo.trim() ||!formData.telePhoneNo.trim()||!formData.supplierId) {

      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Purchase Group Added Successfully!');
    // Save the new purchase group to localStorage
  const savedPurchaseGroups = JSON.parse(localStorage.getItem('purchaseGroups')) || [];
  const updatedPurchaseGroups = [...savedPurchaseGroups, formData];
  localStorage.setItem('purchaseGroups', JSON.stringify(updatedPurchaseGroups));

    if (onAddPurchaseGroup) {
      onAddPurchaseGroup(formData);
    }

    setTimeout(() => {
      setSuccessMessage('');
      navigate('/purchase-groups', { state: { newCustomerGroup: formData } });
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

      {[
        { label: 'Purchase Group Id', name:'purchaseGroupId'},
        { label: 'Purchase Group Name', name:'purchaseGroupName'},  
        { label: 'Address', name:'address'},
        { label: 'Contact Name', name:'contactName'},
        { label: 'Telephone No', name:'telePhoneNo'},
        { label: 'Email', name:'email'},
        { label: 'Supplier Id', name:'supplierId'},
      
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
