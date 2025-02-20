import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const SuppliersInfoTable = ({ suppliers }) => {
  const [search, setSearch] = useState('');
  const [sortDirection] = useState('asc');
  const navigate = useNavigate();

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    const dateA = new Date(a.dateOfConnected);
    const dateB = new Date(b.dateOfConnected);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleClose = () => {
    navigate('/employee-dashboard');
  };

  const handleEdit = (supplierId) => {
    const supplier = suppliers.find((s) => s.supplierId === supplierId); // Find the specific supplier
    navigate(`/edit-supplier/${supplierId}`, {
      state: { supplier },
    }); // Pass the supplier data to the Edit form
  };

  const handleViewSupplier = (supplier) => {
    navigate(`/view-supplier/${supplier.supplierId}`, {
      state: { supplier },
    });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='p-1 m-1 text-2xl'>Suppliers Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='flex items-center justify-between p-2 m-2'>
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

      <div className='p-2 m-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Supplier Name
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Supplier Address
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Contact Number
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Purchase Group
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Credit Period
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Credit Limit
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
                  {supplier.supplierName}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.supplierAddress}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.contactNumber}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.purchaseGroup}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.creditPeriod}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {supplier.creditLimit}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleEdit(supplier.supplierId)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleViewSupplier(supplier)}
                  >
                    View
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
      supplierId: PropTypes.string.isRequired,
      supplierName: PropTypes.string.isRequired,
      supplierAddress: PropTypes.string.isRequired,
      contactNumber: PropTypes.string.isRequired,
      purchaseGroup: PropTypes.string.isRequired,
      creditPeriod: PropTypes.string.isRequired,
      creditLimit: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SuppliersInfoTable;
