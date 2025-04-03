import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { updatePurchaseGroups } from '../../../../../api/EmployeeApiService';

const EditPurchaseGroupForm = ({ onUpdatePurchaseGroup }) => {
  const { state } = useLocation();
  const purchaseGroup = state?.purchaseGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseGroupName: '',
    purchaseGroupAddress: '',
    purchaseGroupContactName: '',
    purchaseGroupPhoneNo: '',
    purchaseGroupFaxNo: '',
    purchaseGroupEmail: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!purchaseGroup) {
      setErrorMessage('No purchase group data provided for editing.');
      navigate('/employee-dashboard/purchase-group-info');
      return;
    }
    setFormData({
      purchaseGroupName: purchaseGroup.purchaseGroupName || '',
      purchaseGroupAddress: purchaseGroup.purchaseGroupAddress || '',
      purchaseGroupContactName: purchaseGroup.purchaseGroupContactName || '',
      purchaseGroupPhoneNo: purchaseGroup.purchaseGroupPhoneNo
        ? String(purchaseGroup.purchaseGroupPhoneNo)
        : '',
      purchaseGroupFaxNo: purchaseGroup.purchaseGroupFaxNo || '',
      purchaseGroupEmail: purchaseGroup.purchaseGroupEmail || '',
    });
  }, [purchaseGroup, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    const requiredFields = [
      'purchaseGroupName',
      'purchaseGroupAddress',
      'purchaseGroupContactName',
      'purchaseGroupPhoneNo',
      'purchaseGroupFaxNo',
      'purchaseGroupEmail',
    ];
    if (requiredFields.some((field) => !formData[field].trim())) {
      setErrorMessage('Please fill out all required fields.');
      setIsLoading(false);
      return;
    }

    // Phone number validation
    if (!/^0[0-9]{9}$/.test(formData.purchaseGroupPhoneNo)) {
      setErrorMessage(
        'Phone number must start with 0 and contain exactly 10 digits.',
      );
      setIsLoading(false);
      return;
    }

    const id = purchaseGroup?.purchaseGroupId;
    if (!id) {
      setErrorMessage('Purchase group ID is missing.');
      setIsLoading(false);
      return;
    }

    // Prepare request data with proper types
    const requestData = {
      purchaseGroupName: formData.purchaseGroupName,
      purchaseGroupAddress: formData.purchaseGroupAddress,
      purchaseGroupContactName: formData.purchaseGroupContactName,
      purchaseGroupPhoneNo: parseInt(formData.purchaseGroupPhoneNo, 10),
      purchaseGroupFaxNo: formData.purchaseGroupFaxNo,
      purchaseGroupEmail: formData.purchaseGroupEmail,
    };

    try {
      const response = await updatePurchaseGroups(id, requestData);

      setSuccessMessage('Purchase Group updated successfully!');
      if (onUpdatePurchaseGroup) {
        onUpdatePurchaseGroup(response.data.data || response.data);
      }
      setTimeout(() => {
        navigate('/employee-dashboard/purchase-group-info');
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to update purchase group',
      );
      console.error('Error updating purchase group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/employee-dashboard/purchase-group-info');
  };

  if (!purchaseGroup || !purchaseGroup.purchaseGroupId) {
    return (
      <div className='p-5 text-center text-red-600'>
        {errorMessage || 'Invalid purchase group data'}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
        Edit Purchase Group
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4 text-center'>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4 text-center'>
          {successMessage}
        </p>
      )}

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupName'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Name:
        </label>
        <input
          type='text'
          id='purchaseGroupName'
          name='purchaseGroupName'
          value={formData.purchaseGroupName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupAddress'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Address:
        </label>
        <input
          type='text'
          id='purchaseGroupAddress'
          name='purchaseGroupAddress'
          value={formData.purchaseGroupAddress}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupContactName'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Contact Name:
        </label>
        <input
          type='text'
          id='purchaseGroupContactName'
          name='purchaseGroupContactName'
          value={formData.purchaseGroupContactName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupPhoneNo'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Phone Number:
        </label>
        <input
          type='tel'
          id='purchaseGroupPhoneNo'
          name='purchaseGroupPhoneNo'
          value={formData.purchaseGroupPhoneNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupFaxNo'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Fax Number:
        </label>
        <input
          type='text'
          id='purchaseGroupFaxNo'
          name='purchaseGroupFaxNo'
          value={formData.purchaseGroupFaxNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex items-center mb-4'>
        <label
          htmlFor='purchaseGroupEmail'
          className='text-[16px] text-gray-800 w-1/3 text-left'
        >
          Email:
        </label>
        <input
          type='email'
          id='purchaseGroupEmail'
          name='purchaseGroupEmail'
          value={formData.purchaseGroupEmail}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          required
        />
      </div>

      <div className='flex justify-center gap-2'>
        <button
          type='submit'
          disabled={isLoading}
          className='px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b] transition-all duration-300 disabled:opacity-50'
        >
          {isLoading ? 'Updating...' : 'Update'}
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className='px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b] transition-all duration-300'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

EditPurchaseGroupForm.propTypes = {
  onUpdatePurchaseGroup: PropTypes.func,
};

EditPurchaseGroupForm.defaultProps = {
  onUpdatePurchaseGroup: () => {},
};

export default EditPurchaseGroupForm;
