import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ProductsInfoTable = ({ products }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClose = () => {
    navigate('/home');
  };

  const handleEdit = (product) => {
    navigate("/edit-product", { state: { product } }); // Pass correct product data
  };
  const handleViewProducts = (product) => {
    navigate(`/view-product/${product.productId}`, { state: { product } });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='p-1 m-1 text-2xl'>Products Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='flex items-center justify-between p-2 m-2'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Products</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search Products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
          />
        </div>
      </div>

      {filteredProducts.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No products found matching your search.
        </div>
      )}

      <div className='p-2 m-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Purchase Group Id
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Product Ref Id
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Product Name
              </th>

              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Generic Name
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Product Status
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Reorder Limit By Package
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.purchaseGroupId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.productRefId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.productName}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.genericName}
                </td>

                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.productStatus}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {product.reorderLimitByPackage}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleViewProducts(product)}
                  >
                    View
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
      purchaseGroupId: PropTypes.string.isRequired,
      productRefId: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      genericName: PropTypes.string.isRequired,
      productStatus: PropTypes.string.isRequired,
      reorderLimitByPackage: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default ProductsInfoTable;
