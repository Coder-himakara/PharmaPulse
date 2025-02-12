/* eslint-disable prettier/prettier */

import { useLocation, useNavigate } from "react-router-dom";

const ViewProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="p-5 text-center text-red-500">
        <h2>Product not found</h2>
        <button
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/products-info")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]">
        Products Details
      </h2>
      <div className="flex items-center justify-center mb-4"></div>
      <ul className="text-left ">
        <li>
          <strong>Product Name:</strong> {product.productName}
        </li>
        <li>
          <strong>Generic Name:</strong> {product.genericName}
        </li>
        <li>
          <strong>Description:</strong> {product.description}
        </li>
        <li>
          <strong>Purchase Group Name:</strong> {product.purchaseGroupName}
        </li>
        <li>
          <strong>Model No:</strong> {product.modelNo}
        </li>
        <li>
          <strong>Category:</strong> {product.category}
        </li>
        <li>
          <strong>Dosage Form:</strong> {product.dosageForm}
        </li>
        <li>
          <strong>Selling Unit:</strong>
          {product.sellingUnit}
        </li>
        <li>
          <strong>Package Type:</strong> {product.packageType}
        </li>
        <li>
          <strong>Status:</strong> {product.status}
        </li>
        <li>
          <strong>Reorder Limit:</strong>
          {product.reorderLimit}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/products-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewProductDetails;
