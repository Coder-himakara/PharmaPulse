import './Tables.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductsInfoTable = ({ products, onEdit }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isVisible, setIsVisible] = useState(true);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.expireDate);
    const dateB = new Date(b.expireDate);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortDirection((prevDirection) =>
      prevDirection === 'asc' ? 'desc' : 'asc',
    );
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className='items-container'>
      <div className='items-header'>
        <h1>Products Management</h1>
        <button className='close-button' onClick={handleClose}>
          X
        </button>
      </div>

      <div className='items-title-search'>
        <h2>Products</h2>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search Products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='search-bar'
          />
        </div>
      </div>

      {sortedProducts.length === 0 && search && (
        <div className='error-message'>
          No products found matching your search.
        </div>
      )}

      <div className='items-table-container'>
        <table className='items-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Product ID</th>
              <th>Batch ID</th>
              <th>Category</th>
              <th>Supplier ID</th>
              <th>Current Stock</th>
              <th onClick={toggleSort} className='sortable'>
                Expiry Date {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th>Unit Price (Rs.)</th>
              <th>Wholesale Price (Rs.)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.productId}</td>
                <td>{product.batchId}</td>
                <td>{product.category}</td>
                <td>{product.supplierId}</td>
                <td>{product.currentStock}</td>
                <td>{product.expireDate}</td>
                <td>{product.unitPrice}</td>
                <td>{product.wholesalePrice}</td>
                <td>
                  <button
                    className='edit-button'
                    onClick={() => onEdit(product)}
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

ProductsInfoTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productName: PropTypes.string.isRequired,
      productId: PropTypes.string.isRequired,
      batchId: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      supplierId: PropTypes.string.isRequired,
      currentStock: PropTypes.number.isRequired,
      expireDate: PropTypes.string.isRequired,
      unitPrice: PropTypes.number.isRequired,
      wholesalePrice: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProductsInfoTable;
