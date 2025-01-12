import './Tables.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const CustomersInfoTable = ({ customers }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // Ascending by default
  const [isVisible, setIsVisible] = useState(true); // To control the visibility of the container

  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort customers based on dateOfConnected
  const sortedCustomers = filteredCustomers.sort((a, b) => {
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

  // Toggle visibility of customers container
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // If not visible, render nothing

  return (
    <div className='items-container'>
      <div className='items-header'>
        <h1>Customers Management</h1>
        <button className='close-button' onClick={handleClose}>
          X
        </button>
      </div>

      <div className='items-title-search'>
        <h2>Customers</h2>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search Customers...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='search-bar'
          />
        </div>
      </div>

      {sortedCustomers.length === 0 && search && (
        <div className='error-message'>
          No customers found matching your search.
        </div>
      )}

      <div className='items-table-container'>
        <table className='items-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Customer ID</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Email</th>
              <th onClick={toggleSort} className='sortable'>
                Date of Connected {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{customer.customerName}</td>
                <td>{customer.customerId}</td>
                <td>{customer.contactNumber}</td>
                <td>{customer.address}</td>
                <td>{customer.email}</td>
                <td>{customer.dateOfConnected}</td>
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

CustomersInfoTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerName: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      contactNumber: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      dateOfConnected: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomersInfoTable;
