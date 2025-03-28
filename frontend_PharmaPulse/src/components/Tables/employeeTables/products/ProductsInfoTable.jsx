/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductsInfoTable = ({ refreshTrigger }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await axios.get(
          "http://localhost:8090/api/products/all",
          {
            headers: {
              "Content-Type": "application/json",
            },
            auth: {
              username: "employee",
              password: "employee123",
            },
          }
        );
        console.log("Response:", response.data);
        setProducts(response.data.data || []);
        setErrorMessage("");
        setLoading(false);
      } catch (error) {
        let errorMsg = "Failed to fetch products";
        if (error.response) {
          if (error.response.status === 403) {
            errorMsg = "No permission to access products. Please check your credentials or role.";
          } else {
            errorMsg = error.response.data?.message || errorMsg;
          }
        } else {
          errorMsg = error.message || errorMsg;
        }
        setErrorMessage(errorMsg);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  const filteredProducts = products.filter((product) =>
    (product.productName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    navigate(`/employee-dashboard/edit-product/${product.id}`, { // Changed to product.id
      state: { product },
    });
  };

  const handleViewProducts = (product) => {
    console.log("Viewing product with ID:", product.id); // Log the ID for debugging
    navigate(`/employee-dashboard/view-product/${product.id}`, { // Changed to product.id
      state: { product },
    });
  };

  if (loading) {
    return <div className="p-5 text-center text-gray-800">Loading products...</div>;
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md">
      <div className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg relative">
        <h1 className="text-lg">Products Management</h1>
        <button
          onClick={handleClose}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-2xl cursor-pointer hover:text-[#f1f1f1]"
        >
          X
        </button>
      </div>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] text-gray-800 font-bold">Products</h2>
        <input
          type="text"
          placeholder="Search Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {search ? "No products found matching your search." : "No products available."}
        </p>
      )}

      {filteredProducts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-400">
            <thead>
              <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
                {[
                  "Purchase Group ID",
                  "Product Ref Id",
                  "Product Name",
                  "Generic Name",
                  "Product Status",
                  "Reorder Limit By Package",
                  "Action",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="p-2 text-center border border-gray-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={index}
                  className="bg-[#c6dceb] hover:bg-[#dce4e9] border border-gray-400"
                >
                  <td className="p-2 text-center border border-gray-400">
                    {product.purchaseGroupId || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {product.productRefId || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {product.productName || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {product.genericName || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {product.productStatus || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    {product.reorderLimitByPackage || "N/A"}
                  </td>
                  <td className="p-2 text-center border border-gray-400">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-4 py-1 bg-[#2a4d69] text-white border-none rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewProducts(product)}
                        className="px-4 py-1 bg-[#2a4d69] text-white border-none rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

ProductsInfoTable.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default ProductsInfoTable;