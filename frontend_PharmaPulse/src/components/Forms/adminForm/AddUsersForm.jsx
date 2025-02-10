/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AddUsersForm = ({ onAddUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    userId: '',
    nicNumber: '',
    email: '',
    contactNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    dateOfJoined: '',
    lastLoginDate:'',
    profilePicture: null,
    status:'',
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

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.userId ||
      !formData.nicNumber ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.role ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dateOfJoined ||
      !formData.lastLoginDate ||
      !formData.status
     
    ) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    
    if (!/^0[0-9]{9}$/.test(formData.contactNumber)) {
      setErrorMessage('Contact number must start with 0 and contain exactly 10 digits.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Account created successfully!');
    if (onAddUser) {
      onAddUser(formData);
    }

    setTimeout(() => {
      setFormData({
        username: '',
        userId: '',
        nicNumber: '',
        email: '',
        contactNumber: '',
        address: '',
        role: '',
        password: '',
        confirmPassword: '',
        dateOfJoined: '',
        lastLoginDate:'',
        profilePicture: null,
        status:'',
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
        Create Account
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
        ['Username', 'username', 'text'],
        ['User ID', 'userId', 'text'],
        ['NIC Number', 'nicNumber', 'text'],
        ['Email', 'email', 'email'],
        ['Contact Number', 'contactNumber', 'text'],
        ['Address', 'address', 'text'],
        ['Password', 'password', 'password'],
        ['Confirm Password', 'confirmPassword', 'password'],
        ['Date of Joined', 'dateOfJoined', 'date'],
        ['Last Login Date', 'lastLoginDate', 'date'],
       
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
        <label htmlFor='role' className='text-[16px] text-gray-800 w-2/3'>
          Role:
        </label>
        <select
          id='role'
          name='role'
          value={formData.role}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        >
          <option value=''>Choose a role</option>
          <option value='Employee'>Employee</option>
          <option value='Sales Representative'>Sales Representative</option>
        </select>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='profilePicture'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Profile Picture:
        </label>
        <input
          type='file'
          id='profilePicture'
          name='profilePicture'
          onChange={handleFileChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
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
          <option value='Inactive'>Inactive</option>
          <option value='Locked'>Locked</option>
          <option value='Suspended'>Suspended</option>
        </select>
      </div>

      <div className='flex justify-center gap-2 mt-5'>
        <button
          type='submit'
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
        >
          Sign Up
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

AddUsersForm.propTypes = {
  onAddUser: PropTypes.func.isRequired,
};

export default AddUsersForm;
