import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Importing search icon

const EditSuppliersForm = ({ onUpdateSupplier }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const supplier = state?.supplier; // Get supplier from the state

  const [formData, setFormData] = useState({
    supplierName: '',
    supplierAddress: '',
    contactNumber: '',
    purchaseGroup: '',
    creditPeriod: '',
    creditLimit: '',
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName,
        supplierAddress: supplier.supplierAddress,
        contactNumber: supplier.contactNumber,
        purchaseGroup: supplier.purchaseGroup,
        creditPeriod: supplier.creditPeriod,
        creditLimit: supplier.creditLimit,
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
    if (!formData.supplierName || !formData.purchaseGroup) {
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
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
        Edit Supplier
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
          htmlFor='supplierName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Supplier Name:
        </label>
        <input
          type='text'
          id='supplierName'
          name='supplierName'
          value={formData.supplierName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='supplierAddress'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Supplier Address:
        </label>
        <input
          type='text'
          id='supplierAddress'
          name='supplierAddress'
          value={formData.supplierAddress}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
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
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroup'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Purchase Group:
        </label>
        <input
          type='text'
          id='purchaseGroup'
          name='purchaseGroup'
          value={formData.purchaseGroup}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
        <FaSearch className='absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3' />
      </div>
      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='creditPeriod'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Credit Period:
        </label>
        <input
          type='text'
          id='creditPeriod'
          name='creditPeriod'
          value={formData.creditPeriod}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='creditLimit'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Credit Limit:
        </label>
        <input
          type='text'
          id='creditLimit'
          name='creditLimit'
          value={formData.creditLimit}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex justify-center gap-2'>
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

EditSuppliersForm.propTypes = {
  supplier: PropTypes.object.isRequired,
  onUpdateSupplier: PropTypes.func.isRequired,
};

export default EditSuppliersForm;
