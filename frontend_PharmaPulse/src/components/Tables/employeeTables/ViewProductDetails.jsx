/* eslint-disable prettier/prettier */
import { useLocation, useNavigate } from "react-router-dom";

const ViewProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
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
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/products-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewProductDetails;
