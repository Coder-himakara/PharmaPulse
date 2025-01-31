/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const PurchaseGroupInfoTable = ({ purchaseGroups }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Filter the purchase groups based on the search term
  const filteredPurchaseGroups = purchaseGroups.filter(({ purchaseGroupName }) =>
    purchaseGroupName.toLowerCase().includes(search.toLowerCase())
  );

  // Close button action
  const handleClose = () => navigate('/home');

  // Edit button action
  const handleEdit = (purchaseGroupId) => {
    const purchaseGroupToEdit = purchaseGroups.find(pg => pg.purchaseGroupId === purchaseGroupId);
    navigate(`/edit-purchase-group/${purchaseGroupId}`, { state: { purchaseGroup: purchaseGroupToEdit } });
  };
  
  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5'>
      <div className='bg-[#1a5353] text-white px-4 py-3 rounded-t-lg relative'>
        <h1 className='text-2xl'>Purchase Groups Management</h1>
        <button onClick={handleClose} className='absolute text-2xl transform -translate-y-1/2 top-1/2 right-2'>X</button>
      </div>
      <div className='flex justify-between p-2'>
        <h2 className='text-2xl text-[#1a5353]'>Purchase Groups</h2>
        <input
          type='text'
          value={search}
          onChange={pg => setSearch(pg.target.value)}
          placeholder='Search Purchase Groups...'
          className='px-3 py-2 border rounded-md text-sm w-[400px]'
        />
      </div>
      {/* Display message when no search results */}
      {filteredPurchaseGroups.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2'>No purchase groups found matching your search.</div>
      )}
      {/* Table displaying purchase groups */}
      <div className='p-2 overflow-x-auto'>
        <table className='w-full border border-collapse border-gray-400'>
          <thead>
            <tr className='bg-[#ffb24d] text-[#5e5757] text-sm'>
              {['#', 'Purchase Group ID', 'Purchase Group Name', 'Address', 'Contact Name', 'Telephone No', 'Email', 'Supplier ID', 'Action'].map((header, index) => (
                <th key={index} className='p-2 text-center border border-gray-400'>{header}</th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {filteredPurchaseGroups.map((purchaseGroup, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='p-2 text-center border border-gray-400'>{index + 1}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.purchaseGroupId}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.purchaseGroupName}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.address}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.contactName}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.telePhoneNo}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.email}</td>
                <td className='p-2 text-center border border-gray-400'>{purchaseGroup.supplierId}</td>
                <td className='p-2 text-center border border-gray-400'>
                  <button
                    onClick={() => handleEdit(purchaseGroup.purchaseGroupId)}
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md text-sm hover:bg-[#15375c]'
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PurchaseGroupInfoTable.propTypes = {
  purchaseGroups: PropTypes.arrayOf(
    PropTypes.shape({
      purchaseGroupId: PropTypes.string.isRequired,
      purchaseGroupName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      contactName: PropTypes.string.isRequired,
      telePhoneNo: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      supplierId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PurchaseGroupInfoTable;
