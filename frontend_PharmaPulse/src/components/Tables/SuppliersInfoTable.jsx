import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const SuppliersInfoTable = ({ suppliers }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    const dateA = new Date(a.dateOfConnected);
    const dateB = new Date(b.dateOfConnected);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortDirection((prevDirection) =>
      prevDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const handleClose = () => {
    navigate('/home');
  };

  const handleEdit = (supplierId) => {
    const supplier = suppliers.find((s) => s.supplierId === supplierId); // Find the specific supplier
    navigate(`/edit-supplier/${supplierId}`, { state: { supplier } }); // Pass the supplier data to the Edit form
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='m-1 p-1 text-2xl'>Suppliers Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='m-2 p-2 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Suppliers</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search Suppliers...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
          />
        </div>
      </div>

      {sortedSuppliers.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No suppliers found matching your search.
        </div>
      )}

      <div className='m-2 p-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                #
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Supplier Name
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Supplier ID
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Contact Number
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Address
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Email
              </th>
              <th
                onClick={toggleSort}
                className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm cursor-pointer underline font-bold'
              >
                Date of Connected {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSuppliers.map((supplier, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {index + 1}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.supplierName}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.supplierId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.contactNumber}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.address}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.email}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.dateOfConnected}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]'
                    onClick={() => handleEdit(supplier.supplierId)}
                  >
                    Edit
                  </button>
                </td>{' '}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

SuppliersInfoTable.propTypes = {
  suppliers: PropTypes.arrayOf(
    PropTypes.shape({
      supplierName: PropTypes.string.isRequired,
      supplierId: PropTypes.string.isRequired,
      contactNumber: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      dateOfConnected: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SuppliersInfoTable;
