import './ProductsInfoTable.css';
import { useState } from 'react';

const ProductsInfoTable = () => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // Ascending by default

  const products = [
    {
      name: 'Paracetamol',
      productId: 'P001',
      batchId: 'B001',
      category: 'Tablet',
      supplierId: 'S001',
      currentStock: 12,
      expiredDate: '2024-12-24',
      unitPrice: 5,
      wholesalePrice: 3,
    },
    {
      name: 'Ibuprofen',
      productId: 'P002',
      batchId: 'B002',
      category: 'Capsule',
      supplierId: 'S002',
      currentStock: 50,
      expiredDate: '2024-03-22',
      unitPrice: 60,
      wholesalePrice: 45,
    },
    {
      name: 'Cough Syrup',
      productId: 'P003',
      batchId: 'B003',
      category: 'Syrup',
      supplierId: 'S003',
      currentStock: 25,
      expiredDate: '2024-08-04',
      unitPrice: 250,
      wholesalePrice: 200,
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort products based on expiredDate
  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.expiredDate);
    const dateB = new Date(b.expiredDate);

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

  return (
    <div className='products-container'>
      {/* Header Section */}
      <div className='products-header'>
        <h1>Products Management</h1>
      </div>

      {/* Title with Search Bar */}
      <div className='products-title-search'>
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

      {/* Error Message for Empty Search Results */}
      {sortedProducts.length === 0 && search && (
        <div className='error-message'>
          No products found matching your search.
        </div>
      )}

      {/* Table Section */}
      <div className='products-table-container'>
        <table className='products-table'>
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
                Expired Date {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th>Unit Price (Rs.)</th>
              <th>Wholesale Price (Rs.)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.productId}</td>
                <td>{product.batchId}</td>
                <td>{product.category}</td>
                <td>{product.supplierId}</td>
                <td>{product.currentStock}</td>
                <td>{product.expiredDate}</td>
                <td>{product.unitPrice}</td>
                <td>{product.wholesalePrice}</td>
                <td>
                  <button className='edit-button'>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsInfoTable;
