/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const PurchaseGroupInfoTable = ({ purchaseGroups }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();
  
  const filteredPurchaseGroups = purchaseGroups.filter(({ purchaseGroupName }) =>
    purchaseGroupName.toLowerCase().includes(search.toLowerCase())
  );
  const sortedPurchaseGroups = filteredPurchaseGroups.sort((a, b) => {
    const dateA = new Date(a.dateOfConnected), dateB = new Date(b.dateOfConnected);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });



  const toggleSort = () => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  const handleClose = () => navigate('/home');
  const handleEdit =purchaseGroupId => {
  const purchaseGroup = purchaseGroups.find(c => c.purchaseGroupId === purchaseGroupId);
    navigate(`/edit-purchase-group/${purchaseGroupId}`, { state: { purchaseGroup } });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5'>
      <div className='bg-[#1a5353] text-white px-4 py-3 rounded-t-lg relative'>
        <h1 className='text-2xl'>PurchaseGroups Management</h1>
        <button onClick={handleClose} className='absolute text-2xl transform -translate-y-1/2 top-1/2 right-2'>X</button>
      </div>
      <div className='flex justify-between p-2'>
        <h2 className='text-2xl text-[#1a5353]'>Purchase Groups</h2>
        <input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search Purchase Groups...'
          className='px-3 py-2 border rounded-md text-sm w-[400px]'
        />
      </div>
      {sortedPurchaseGroups.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2'>No purchase groups found matching your search.</div>
      )}
      <div className='p-2 overflow-x-auto'>
        <table className='w-full border border-collapse border-gray-400'>
          <thead>
            <tr className='bg-[#ffb24d] text-[#5e5757] text-sm'>
              {['#', 'purchaseGroupId', 'purchaseGroupName', 'address', 'contactName', 'telePhoneNo','email', 'supplierId','Action'].map((header, index) => (
                <th key={index} className='p-2 text-center border border-gray-400'>
                  {header === 'Date of Connected' ? (
                    <span onClick={toggleSort} className='underline cursor-pointer'>{header} {sortDirection === 'asc' ? '▲' : '▼'}</span>
                  ) : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPurchaseGroups.map((group, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='p-2 text-center border border-gray-400'>{index + 1}</td>
                <td className='p-2 text-center border border-gray-400'>{group.purchaseGroupId}</td>
                <td className='p-2 text-center border border-gray-400'>{group.purchaseGroupName}</td>
                <td className='p-2 text-center border border-gray-400'>{group.address}</td>
                <td className='p-2 text-center border border-gray-400'>{group.contactName}</td>
                <td className='p-2 text-center border border-gray-400'>{group.telePhoneNo}</td>
                <td className='p-2 text-center border border-gray-400'>{group.email}</td>
                <td className='p-2 text-center border border-gray-400'>{group.supplierId}</td>
                <td className='p-2 text-center border border-gray-400'>
                  <button
                    onClick={() => handleEdit(group.purchaseGroupId)}
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
        email:PropTypes.string.isRequired,
        supplierId:PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default PurchaseGroupInfoTable;
