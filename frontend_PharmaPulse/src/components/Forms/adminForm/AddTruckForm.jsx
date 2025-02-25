import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddTruckForm = ({ onAddTruck }) => {
  const [formData, setFormData] = useState({
    truckId: '',
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
      !formData.truckId ||
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
    if (onAddTruck) {
      onAddTruck(formData);
    }

    setTimeout(() => {
      setFormData({
        truckId: '',
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
    navigate('/admin-dashboard');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Add Truck
      </h2>

      {errorMessage && (
        <p className='mb-4 text-sm font-bold text-red-600'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='mb-4 text-sm font-bold text-green-600'>
          {successMessage}
        </p>
      )}

      {[
        ['Truck ID', 'truckId', 'text'],
        ['Number Plate', 'numberPlate', 'text'],
        ['Representative ID', 'representativeId', 'text'],
        ['Capacity(t)', 'capacity', 'number'],
        ['Date of Added', 'dateOfAdded', 'date'],
      ].map(([label, name, type]) => (
        <div key={name} className='flex items-center justify-between mb-4'>
          <label htmlFor={name} className='text-[16px] text-gray-800 w-2/3'>
            {label}:
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          />
        </div>
      ))}

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='status' className='text-[16px] text-gray-800 w-2/3'>
          Status:
        </label>
        <select
          id='status'
          name='status'
          value={formData.status}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
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

AddTruckForm.propTypes = {
  onAddTruck: PropTypes.func.isRequired,
};

export default AddTruckForm;
