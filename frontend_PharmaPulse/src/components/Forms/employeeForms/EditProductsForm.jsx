/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditProductsForm = ({ onUpdateProduct }) => {
  const { state } = useLocation(); // Access the state passed by navigate
  const product = state?.product; // Get product from the state

  const [formData, setFormData] = useState({
    purchaseGroup: "",
    productRefId: "",
    productName: "",
    genericName: "",
    description: "",
    category: "",
    packageType: "",
    unitsPerPackage: "",
    productStatus: "",
    reorderLimitByPackage: "",
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        purchaseGroup: product.purchaseGroup,
        productRefId: product.productRefId,
        productName: product.productName,
        genericName: product.genericName,
        description: product.description,
        category: product.category,
        packageType: product.packageType,
        unitsPerPackage: product.unitsPerPackage,
        productStatus: product.productStatus,
        reorderLimitByPackage: product.reorderLimitByPackage,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage(""); // Clear errors

    // Pass the updated product data to the parent
    if (onUpdateProduct) {
      onUpdateProduct(formData);
    }

    setSuccessMessage("Product updated successfully!");

    // Clear the form and success message after a delay
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/products-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/products-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Product
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4">
          {successMessage}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="purchaseGroup"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Purchase Group:
        </label>
        <input
          type="text"
          id="purchaseGroup"
          name="purchaseGroup"
          value={formData.purchaseGroup}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="productRefId"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Product Ref Id:
        </label>
        <input
          type="text"
          id="productRefId"
          name="productRefId"
          value={formData.productRefId}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="productName"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Product Name:
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="genericName"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Generic Name:
        </label>
        <input
          type="text"
          id="genericName"
          name="genericName"
          value={formData.genericName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="description"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Description:
        </label>
        <div className="relative w-2/3">
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="category" className="text-[16px] text-gray-800 w-2/3">
          Category:
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        >
          <option value="">Choose a category</option>
          <option value="MEDICINE">MEDICINE</option>
          <option value="SURGICAL">SURGICAL</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="packageType"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Package Type:
        </label>
        <select
          id="packageType"
          name="packageType"
          value={formData.packageType}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        >
          <option value="">Choose a packageType</option>
          <option value="VIAL">VIAL</option>
          <option value="BOTTLE">BOTTLE</option>
          <option value="BOX">BOX</option>
          <option value="BLISTER PACK">BLISTER PACK</option>
          <option value="POUCH">POUCH</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="unitsPerPackage"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Units Per Package:
        </label>
        <input
          type="number"
          id="unitsPerPackage"
          name="unitsPerPackage"
          value={formData.unitsPerPackage}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="productStatus"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Product Status:
        </label>
        <select
          id="productStatus"
          name="productStatus"
          value={formData.productStatus}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        >
          <option value="">Choose a status</option>
          <option value="active">ACTIVE</option>
          <option value="inactive">INACTIVE</option>
          <option value="discontinued">DISCONTINUED</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="reorderLimitByPackage"
          className="text-[16px] text-gray-800 w-2/3"
        >
          Reorder Limit By Package:
        </label>
        <input
          type="number"
          id="reorderLimitByPackage"
          name="reorderLimitByPackage"
          value={formData.reorderLimitByPackage}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm text-gray-800 border border-red-300 rounded-md"
        />
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="submit"
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

EditProductsForm.propTypes = {
  product: PropTypes.object.isRequired,
  onUpdateProduct: PropTypes.func.isRequired,
};

export default EditProductsForm;
