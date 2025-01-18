import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ProductsInfoTable = ({ products }) => {
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.expireDate);
    const dateB = new Date(b.expireDate);
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const handleClose = () => {
    navigate("/sidebar");
  };

  const handleEdit = (productId) => {
    const product = products.find((p) => p.productId === productId); // Find the specific product
    navigate(`/edit-product/${productId}`, { state: { product } }); // Pass the product data to the Edit form
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="m-1 p-1 text-2xl">Products Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="m-2 p-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a5353]">Products</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {sortedProducts.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No products found matching your search.
        </div>
      )}

      <div className="m-2 p-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                #
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Product Name
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Product ID
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Batch ID
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Category
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Supplier ID
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Current Stock
              </th>
              <th
                onClick={toggleSort}
                className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm cursor-pointer underline font-bold"
              >
                Expiry Date {sortDirection === "asc" ? "▲" : "▼"}
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Unit Price (Rs.)
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Wholesale Price (Rs.)
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {index + 1}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.productName}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.productId}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.batchId}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.category}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.supplierId}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.currentStock}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.expireDate}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.unitPrice}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {product.wholesalePrice}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  <button
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c]"
                    onClick={() => handleEdit(product.productId)}
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
    })
  ).isRequired,
};

export default ProductsInfoTable;
