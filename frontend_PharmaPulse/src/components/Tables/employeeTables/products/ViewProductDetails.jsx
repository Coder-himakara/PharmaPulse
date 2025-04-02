/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  // Log the received product for debugging
  console.log("Product in View:", JSON.stringify(product, null, 2));

  // Redirect if no product is provided
  useEffect(() => {
    if (!product) {
      const timer = setTimeout(() => {
        navigate("/employee-dashboard/products-info");
      }, 2000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [product, navigate]);

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)] dark:text-black">
        Product Details
      </h2>
      {!product ? (
        <div className="p-5 text-center text-red-600">
          No product data provided. Redirecting...
        </div>
      ) : (
        <>
          <ul className="space-y-2 text-left">
            <li>
              <strong>Purchase Group:</strong>{" "}
              {product.purchaseGroupId || "N/A"}
            </li>
            <li>
              <strong>Product Ref ID:</strong>{" "}
              {product.productRefId || "N/A"}
            </li>
            <li>
              <strong>Product Name:</strong>{" "}
              {product.productName || "N/A"}
            </li>
            <li>
              <strong>Generic Name:</strong>{" "}
              {product.genericName || "N/A"}
            </li>
            <li>
              <strong>Description:</strong>{" "}
              {product.description || "N/A"}
            </li>
            <li>
              <strong>Category:</strong>{" "}
              {product.category || "N/A"}
            </li>
            <li>
              <strong>Package Type:</strong>{" "}
              {product.packageType || "N/A"}
            </li>
            <li>
              <strong>Units Per Package:</strong>{" "}
              {product.unitsPerPack || "N/A"}
            </li>
            <li>
              <strong>Product Status:</strong>{" "}
              {product.productStatus || "N/A"}
            </li>
            <li>
              <strong>Reorder Limit By Package:</strong>{" "}
              {product.reorderLimitByPackage || "N/A"}
            </li>
          </ul>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
              onClick={() => navigate("/employee-dashboard/products-info")}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewProductDetails;