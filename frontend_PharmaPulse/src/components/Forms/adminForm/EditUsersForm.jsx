import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const EditUsersForm = ({ onUpdateUser }) => {
  const { state } = useLocation();
  const user = state?.user;

  const [formData, setFormData] = useState({
    username: '',
    nicNumber: '',
    email: '',
    contactNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: '',
    profilePicture: null,
    userId: '',
    dateOfJoined: '',
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        nicNumber: user.nicNumber,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        password: '',
        confirmPassword: '',
        role: user.role,
        profilePicture: user.profilePicture,
        userId: user.userId,
        dateOfJoined: user.dateOfJoined,
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
    navigate('/users-info');
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
        <p className='text-[#3c5f3c] text-sm font-bold mb-4'>
          {successMessage}
        </p>
      )}

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Username:</label>
        <input
          type='text'
          name='username'
          value={formData.username}
          onChange={handleChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Email:</label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Password:</label>
        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Confirm Password:</label>
        <input
          type='password'
          name='confirmPassword'
          value={formData.confirmPassword}
          onChange={handleChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
      </div>

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Role:</label>
        <select
          name='role'
          value={formData.role}
          onChange={handleChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        >
          <option value=''>Choose a role</option>
          <option value='Employee'>Employee</option>
          <option value='Sales Representative'>Sales Representative</option>
        </select>
      </div>

      <div className='mb-4'>
        <label className='text-[16px] text-gray-800'>Profile Picture:</label>
        <input
          type='file'
          name='profilePicture'
          onChange={handleFileChange}
          className='w-full px-2 py-2 border border-gray-300 rounded-md text-sm'
        />
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
