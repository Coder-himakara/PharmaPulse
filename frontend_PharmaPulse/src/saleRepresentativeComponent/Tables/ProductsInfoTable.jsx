import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductsInfoTable = ({ products, onSelectProduct }) => {
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

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

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg'>
        <h1 className='text-2xl'>Products Management</h1>
      </div>

      <div className='m-2 p-2 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Products</h2>
        <input
          type='text'
          placeholder='Search Products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
        />
      </div>

      <div className='m-2 p-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border p-2 text-center bg-[#ffb24d]'>Product Name</th>
              <th className='border p-2 text-center bg-[#ffb24d]'>Product ID</th>
              <th className='border p-2 text-center bg-[#ffb24d]'>Retail Price (Rs.)</th>
              <th className='border p-2 text-center bg-[#ffb24d]'>Quantities</th>
              <th className='border p-2 text-center bg-[#ffb24d] cursor-pointer' onClick={toggleSort}>
                Expiry Date {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
              <th className='border p-2 text-center bg-[#ffb24d]'>Manufacturer</th>
              <th className='border p-2 text-center bg-[#ffb24d]'>Select</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='border p-2 text-center'>{product.productName}</td>
                <td className='border p-2 text-center'>{product.productId}</td>
                <td className='border p-2 text-center'>{product.unitPrice}</td>
                <td className='border p-2 text-center'>{product.currentStock}</td>
                <td className='border p-2 text-center'>{product.expireDate}</td>
                <td className='border p-2 text-center'>{product.manufacturer}</td>
                <td className='border p-2 text-center'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md hover:bg-[#15375c]'
                    onClick={() => onSelectProduct(product)}
                  >
                    Select
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
  products: PropTypes.array.isRequired,
  onSelectProduct: PropTypes.func.isRequired,
};

export default ProductsInfoTable;