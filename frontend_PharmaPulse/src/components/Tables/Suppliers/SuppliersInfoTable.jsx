import './SuppliersInfoTable.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const SuppliersInfoTable = ({ suppliers }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // Ascending by default
  const [isVisible, setIsVisible] = useState(true); // To control the visibility of the container

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort products based on expireDate
  const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    const dateA = new Date(a.dateOfConnected);
    const dateB = new Date(b.dateOfConnected);

    if (sortDirection === 'asc') {
      return dateA - dateB; // Ascending order
    } else {
      return dateB - dateA; // Descending order
    }
  });

  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection((prevDirection) =>
      prevDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  // Toggle visibility of products container
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // If not visible, render nothing

  return (
    <div className='suppliers-container'>
      <div className='suppliers-header'>
        <h1>Suppliers Management</h1>
        <button className='close-button' onClick={handleClose}>
          X
        </button>
      </div>

      <div className='suppliers-title-search'>
        <h2>Suppliers</h2>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search Suppliers...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='search-bar'
          />
        </div>
      </div>

      {sortedSuppliers.length === 0 && search && (
        <div className='error-message'>
          No suppliers found matching your search.
        </div>
      )}

      <div className='suppliers-table-container'>
        <table className='suppliers-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Supplier Name</th>
              <th>Supplier ID</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Email</th>
              <th onClick={toggleSort} className='sortable'>
                Date of Connected {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th>Action</th> {/* Added Action column */}
            </tr>
          </thead>
          <tbody>
            {sortedSuppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.supplierId}</td>
                <td>{supplier.contactNumber}</td>
                <td>{supplier.address}</td>
                <td>{supplier.email}</td>
                <td>{supplier.dateOfConnected}</td>
                <td>
                  <button className='edit-button'>Edit</button>
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
