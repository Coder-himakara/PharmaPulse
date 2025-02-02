/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditPurchaseGroupForm = ({ onUpdatePurchaseGroup }) => {
  const { state } = useLocation();
  const purchaseGroup = state?.purchaseGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseGroupId: "",
    purchaseGroupName: "",
    address: "",
    contactName: "",
    telePhoneNo: "",
    email: "",
    supplierId: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (purchaseGroup) {
      setFormData({
        purchaseGroupId: purchaseGroup.purchaseGroupId,
        purchaseGroupName: purchaseGroup.purchaseGroupName,
        address: purchaseGroup.address,
        contactName: purchaseGroup.contactName,
        telePhoneNo: purchaseGroup.telePhoneNo,
        email: purchaseGroup.email,
        supplierId: purchaseGroup.supplierId,
      });
    }
  }, [purchaseGroup]);

  const handleChange = (pg) => {
    const { name, value } = pg.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (pg) => {
    pg.preventDefault();

    if (
      !formData.email ||
      !formData.supplierId ||
      !formData.telePhoneNo
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");

    if (onUpdatePurchaseGroup) {
      onUpdatePurchaseGroup(formData);
    }

    setSuccessMessage("Purchase Group updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/purchase-group-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/purchase-group-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg">
        Edit Purchase Group
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4">
          {successMessage}
        </p>
      )}

<div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='purchaseGroupName'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Purchase Group Name:
        </label>
        <input
          type='text'
          id='purchaseGroupName'
          name='purchaseGroupName'
          value={formData.purchaseGroupName}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          readOnly
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='purchaseGroupId' className='text-[16px] text-gray-800 w-2/3'>
         Purchase Group Id:
        </label>
        <input
          type='text'
          id='purchaseGroupName'
          name='purchaseGroupName'
          value={formData.purchaseGroupName}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
          readOnly
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='address'
          className='text-[16px] text-gray-800 w-2/3'
        >
          Address:
        </label>
        <input
          type='text'
          id='address'
          name='address'
          value={formData.address}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='contactName' className='text-[16px] text-gray-800 w-2/3'>
        Contact Name:
        </label>
        <input
          type='text'
          id='contactName'
          name='contactName'
          value={formData.contactName}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>
      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='telePhoneNo' className='text-[16px] text-gray-800 w-2/3'>
        Telephone No:
        </label>
        <input
          type='text'
          id='telePhoneNo'
          name='telePhoneNo'
          value={formData.telePhoneNo}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label htmlFor='email' className='text-[16px] text-gray-800 w-2/3'>
          Email:
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <label
          htmlFor='supplierId'
          className='text-[16px] text-gray-800 w-2/3'
        >
         Supplier Id
        </label>
        <input
          type='text'
          id='supplierId'
          name='supplierId'
          value={formData.supplierId}
          onChange={handleChange}
          className='w-2/3 px-2 py-2 text-sm text-gray-800 border border-gray-300 rounded-md'
          readOnly
        />
      </div>

      <div className="flex justify-center gap-2 mt-5">
        <button
          type="submit"
          className="px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b]"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2 bg-[#2a4d69] text-white rounded-md hover:bg-[#00796b]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

EditPurchaseGroupForm.propTypes = {
  purchaseGroups: PropTypes.object.isRequired,
  onUpdatePurchaseGroup: PropTypes.func.isRequired,
};

export default EditPurchaseGroupForm;
