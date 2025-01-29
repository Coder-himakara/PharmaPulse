/* eslint-disable prettier/prettier */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CustomerGroupInfoTable = ({ customerGroups }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  const filteredCustomerGroups = customerGroups.filter(({ customerGroupName }) =>
    customerGroupName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCustomerGroups = filteredCustomerGroups.sort((a, b) => {
    const dateA = new Date(a.dateOfConnected), dateB = new Date(b.dateOfConnected);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  const handleClose = () => navigate('/home');
  const handleEdit = customerGroupId => {
    const customerGroup = customerGroups.find(c => c.customerGroupId === customerGroupId);
    navigate(`/edit-customer-group/${customerGroupId}`, { state: { customerGroup } });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5'>
      <div className='bg-[#1a5353] text-white px-4 py-3 rounded-t-lg'>
        <h1 className='text-2xl'>Customer Groups Management</h1>
        <button onClick={handleClose} className='absolute text-2xl transform -translate-y-1/2 top-1/2 right-2'>X</button>
      </div>
      <div className='flex justify-between p-2'>
        <h2 className='text-2xl text-[#1a5353]'>Customer Groups</h2>
        <input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search Customer Groups...'
          className='px-3 py-2 border rounded-md text-sm w-[400px]'
        />
      </div>
      {sortedCustomerGroups.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2'>No customer groups found matching your search.</div>
      )}
      <div className='p-2'>
        <table className='w-full'>
          <thead>
            <tr>
              {['#', 'Customer Group ID','Customer Group Name', 'Sales Rep ID', 'Sales Rep Name', 'Location', 'Action'].map((header, index) => (
                <th key={index} className='p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  {header === 'Date of Connected' ? (
                    <span onClick={toggleSort} className='underline cursor-pointer'>{header} {sortDirection === 'asc' ? '▲' : '▼'}</span>
                  ) : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCustomerGroups.map((group, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='p-2 text-center'>{index + 1}</td>
                <td className='p-2 text-center'>{group.customerGroupName}</td>
                <td className='p-2 text-center'>{group.customerGroupId}</td>
                <td className='p-2 text-center'>{group.salesRepId}</td>
                <td className='p-2 text-center'>{group.salesRepName}</td>
                <td className='p-2 text-center'>{group.location}</td>
                <td className='p-2 text-center'>
                  <button
                    onClick={() => handleEdit(group.customerGroupId)}
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

CustomerGroupInfoTable.propTypes = {
  customerGroups: PropTypes.arrayOf(
    PropTypes.shape({
      customerGroupName: PropTypes.string.isRequired,
      customerGroupId: PropTypes.string.isRequired,
      salesRepId: PropTypes.string.isRequired,
      salesRepName: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
     
    }),
  ).isRequired,
};

export default CustomerGroupInfoTable;
