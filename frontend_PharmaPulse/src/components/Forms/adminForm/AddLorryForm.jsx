import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddLorryForm = ({ onAddLorry }) => {
  const [formData, setFormData] = useState({
    lorryId: '',
    numberPlate: '',
    representativeId: '',
    capacity: '',
    dateOfAdded: '',
    status: '',
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.lorryId ||
      !formData.numberPlate ||
      !formData.representativeId ||
      !formData.capacity ||
      !formData.dateOfAdded ||
      !formData.status
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Lorry added successfully!');
    if (onAddLorry) {
      onAddLorry(formData);
    }

    setTimeout(() => {
      setFormData({
        lorryId: '',
        numberPlate: '',
        representativeId: '',
        capacity: '',
        dateOfAdded: '',
        status: '',
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
        Add Lorry
      </h2>

      {errorMessage && (
        <p className='text-red-600 text-sm font-bold mb-4'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-green-600 text-sm font-bold mb-4'>
          {successMessage}
        </p>
      )}

      {[
        ['Lorry ID', 'lorryId', 'text'],
        ['Number Plate', 'numberPlate', 'text'],
        ['Representative ID', 'representativeId', 'text'],
        ['Capacity(t)', 'capacity', 'number'],
        ['Date of Added', 'dateOfAdded', 'date'],
      ].map(([label, name, type]) => (
        <div key={name} className='flex justify-between items-center mb-4'>
          <label htmlFor={name} className='text-[16px] text-gray-800 w-2/3'>
            {label}:
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
          />
        </div>
      ))}

      <div className='flex justify-between items-center mb-4'>
        <label htmlFor='status' className='text-[16px] text-gray-800 w-2/3'>
          Status:
        </label>
        <select
          id='status'
          name='status'
          value={formData.status}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a status</option>
          <option value='Active'>Active</option>
          <option value='Maintenance'>Maintenance</option>
          <option value='Inactive'>Inactive</option>
        </select>
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

AddLorryForm.propTypes = {
  onAddLorry: PropTypes.func.isRequired,
};

export default AddLorryForm;
