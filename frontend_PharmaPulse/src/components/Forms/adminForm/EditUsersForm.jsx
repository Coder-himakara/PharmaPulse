/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const EditUsersForm = ({ onUpdateUser }) => {
  const { state } = useLocation();
  const user = state?.user;

  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    nicNumber: '',
    email: '',
    contactNumber: '',
    address: '',
    role: '',
    password: '',
    confirmPassword: '',
    dateOfJoined: '',
    lastLoginDate: '',
    profilePicture: null,
    status: '',
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId,
        username: user.username,
        nicNumber: user.nicNumber,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        role: user.role,
        password: '',
        confirmPassword: '',
        dateOfJoined: user.dateOfJoined,
        lastLoginDate: user.lastLoginDate,
        profilePicture: user.profilePicture,
        status: user.status,
      });
    }
  }, [user]);

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

    if (!formData.email || !formData.contactNumber || !formData.role) {
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
    if (onUpdateUser) {
      onUpdateUser(formData);
    }

    setSuccessMessage('User updated successfully!');

    setTimeout(() => {
      setSuccessMessage('');
      navigate('/users-info');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/admin-dashboard/users-info');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Edit User
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4'>{errorMessage}</p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4'>{successMessage}</p>
      )}

      {[
        { label: 'Username', name: 'username', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Contact Number', name: 'contactNumber', type: 'text' },
        { label: 'Address', name: 'address', type: 'text' },
        { label: 'Password', name: 'password', type: 'password' },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
        { label: 'Status', name: 'status', type: 'status' },
      ].map(({ label, name, type }) => (
        <div key={name} className='flex items-center gap-4 mb-4'>
          <label className='text-[16px] text-gray-800 w-1/3'>{label}:</label>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          />
        </div>
      ))}
       <div className='flex items-center gap-4 mb-4'>
        <label htmlFor='role' className='text-[16px] text-gray-800 w-1/3'>Role:</label>
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
      <div className='flex items-center gap-4 mb-4'>
        <label className='text-[16px] text-gray-800 w-1/3'>Profile Picture:</label>
        <input
          type='file'
          name='profilePicture'
          onChange={handleFileChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex items-center gap-4 mb-4'>
        <label className='text-[16px] text-gray-800 w-1/3'>
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

EditUsersForm.propTypes = {
  onUpdateUser: PropTypes.func.isRequired,
};

export default EditUsersForm;
