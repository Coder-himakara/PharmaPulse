/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

  const CustomerGroupInfoTable = ({ customerGroups}) => {
  const [search, setSearch] = useState('');
  const [customerGroupsData, setCustomerGroupsData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Load customer groups from local storage or default to props
  useEffect(() => {
    const savedCustomerGroups = JSON.parse(localStorage.getItem('customerGroups')) || customerGroups;
    setCustomerGroupsData(savedCustomerGroups);
  }, [customerGroups]);


  // Add new customer group from location state
  useEffect(() => {
    if (location.state?.newCustomerGroup) {
      setCustomerGroupsData((prevCustomerGroups) => {
        const updatedGroups = [
          ...prevCustomerGroups,
          { ...location.state.newCustomerGroup, customerGroupId: prevCustomerGroups.length + 1 }
        ];
        localStorage.setItem('customerGroups', JSON.stringify(updatedGroups));
        return updatedGroups;
      });
      navigate(".", { replace: true });
    }
  }, [location.state, navigate]);

  // Filter customer groups based on search input
  const filteredCustomerGroups = customerGroupsData.filter(({ customerGroupName }) =>
    customerGroupName.toLowerCase().includes(search.toLowerCase())
  );

  // Close handler
  const handleClose = () => {
    navigate('/home');
  };

  // Fix handleEdit function
  const handleEdit = (customerGroupId) => {
    const customerGroup = customerGroupsData.find((cg) => cg.customerGroupId === customerGroupId);
    if (customerGroup) {
      navigate(`/edit-customer-group/${customerGroupId}`, {
        state: { customerGroup  },
      });
    }
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5'>
      {/* Header Section */}
      <div className='bg-[#1a5353] text-white px-4 py-3 rounded-t-lg relative'>
        <h1 className='text-2xl'>Customer Groups Management</h1>
        <button
          onClick={handleClose}
          className='absolute text-2xl transform -translate-y-1/2 top-1/2 right-2'>
          X
        </button>
      </div>

      {/* Search Bar */}
      <div className='flex justify-between p-2'>
        <h2 className='text-2xl text-[#1a5353]'>Customer Groups</h2>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search Customer Groups...'
          className='px-3 py-2 border rounded-md text-sm w-[400px]'
        />
      </div>

      {/* Display Message if No Groups Found */}
      {filteredCustomerGroups.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2'>
          No customer groups found matching your search.
        </div>
      )}

      {/* Customer Groups Table */}
      <div className='p-2 overflow-x-auto'>
        <table className='w-full border border-collapse border-gray-400'>
          <thead>
            <tr className='bg-[#ffb24d] text-[#5e5757] text-sm'>
              {['#', 'Customer Group Name', 'Sales Rep ID', 'Sales Rep Name', 'Location', 'Action'].map((header, index) => (
                <th key={index} className='p-2 text-center border border-gray-400'>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCustomerGroups.map((customerGroup, index) => (
              <tr key={customerGroup.customerGroupId} className='bg-[#c6dceb] hover:bg-[#dce4e9] border border-gray-400'>
                <td className='p-2 text-center border border-gray-400'>{index + 1}</td>
                <td className='p-2 text-center border border-gray-400'>{customerGroup.customerGroupName}</td>
                <td className='p-2 text-center border border-gray-400'>{customerGroup.assignSalesRepId || 'N/A'}</td>
                <td className='p-2 text-center border border-gray-400'>{customerGroup.assignSalesRepName || 'N/A'}</td>
                <td className='p-2 text-center border border-gray-400'>{customerGroup.location}</td>
                <td className='p-2 text-center border border-gray-400'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]'
                    onClick={() => handleEdit(customerGroup.customerGroupId)}
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
      customerGroupId: PropTypes.string.isRequired,
      customerGroupName: PropTypes.string.isRequired,
      assignSalesRepId: PropTypes.string.isRequired,
      assignSalesRepName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomerGroupInfoTable;
