/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditProductsForm = ({ onUpdateProduct }) => {
  const { state } = useLocation();
  const product = state?.product;
  const navigate = useNavigate();

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

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Location state:", state);
    console.log("Received product:", product);
    if (!product) {
      setErrorMessage("No product data provided for editing.");
      navigate("/products-info");
      return;
    }
    setFormData({
      purchaseGroup: product.purchaseGroup || "",
      productRefId: product.productRefId || "",
      productName: product.productName || "",
      genericName: product.genericName || "",
      description: product.description || "",
      category: product.category || "",
      packageType: product.packageType || "",
      unitsPerPackage: product.unitsPerPackage || "",
      productStatus: product.productStatus || "",
      reorderLimitByPackage: product.reorderLimitByPackage || "",
    });
  }, [product, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data before submission:", formData);

    if (
      !formData.purchaseGroup.trim() ||
      !formData.productRefId.trim() ||
      !formData.productName.trim() ||
      !formData.genericName.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.packageType.trim() ||
      !formData.unitsPerPackage ||
      !formData.productStatus.trim() ||
      !formData.reorderLimitByPackage
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const id = product.productId; 
    if (!id) {
      setErrorMessage("Product ID is missing. Cannot update without an ID.");
      return;
    }

    const requestData = {
      purchaseGroup: formData.purchaseGroup,
      productRefId: formData.productRefId,
      productName: formData.productName,
      genericName: formData.genericName,
      description: formData.description,
      category: formData.category,
      packageType: formData.packageType,
      unitsPerPackage: parseInt(formData.unitsPerPackage),
      productStatus: formData.productStatus,
      reorderLimitByPackage: parseInt(formData.reorderLimitByPackage),
    };

    try {
      const url = `http://localhost:8090/api/products/update/${id}`; // Adjust URL as per your API
      console.log("Sending PUT request to:", url);
      console.log("Request payload:", requestData);

      const response = await axios.put(url, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "employee",
          password: "employee123",
        },
      });

      console.log("Response:", response.data);
      setErrorMessage("");
      setSuccessMessage("Product updated successfully!");

      if (onUpdateProduct) {
        onUpdateProduct(response.data.data || response.data);
      }

      setTimeout(() => {
        console.log("Navigating back...");
        setSuccessMessage("");
        navigate("/products-info");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update product";
      setErrorMessage(errorMsg);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/products-info");
  };

  if (!product) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "No product data provided"}
      </div>
    );
  }

  const id = product.productId;
  if (!id) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Product ID is missing"}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Product
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="purchaseGroup" className="text-[16px] text-gray-800 w-1/2 text-left">
              Purchase Group:
            </label>
            <input
              type="text"
              id="purchaseGroup"
              name="purchaseGroup"
              value={formData.purchaseGroup}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="productName" className="text-[16px] text-gray-800 w-1/2 text-left">
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="genericName" className="text-[16px] text-gray-800 w-1/2 text-left">
              Generic Name:
            </label>
            <input
              type="text"
              id="genericName"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="description" className="text-[16px] text-gray-800 w-1/2 text-left">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="category" className="text-[16px] text-gray-800 w-1/2 text-left">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a category</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="SURGICAL">SURGICAL</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="productRefId" className="text-[16px] text-gray-800 w-1/2 text-left">
              Product Ref Id:
            </label>
            <input
              type="text"
              id="productRefId"
              name="productRefId"
              value={formData.productRefId}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="packageType" className="text-[16px] text-gray-800 w-1/2 text-left">
              Package Type:
            </label>
            <select
              id="packageType"
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a packageType</option>
              <option value="VIAL">VIAL</option>
              <option value="BOTTLE">BOTTLE</option>
              <option value="BOX">BOX</option>
              <option value="BLISTER PACK">BLISTER PACK</option>
              <option value="POUCH">POUCH</option>
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="unitsPerPackage" className="text-[16px] text-gray-800 w-1/2 text-left">
              Units Per Package:
            </label>
            <input
              type="number"
              id="unitsPerPackage"
              name="unitsPerPackage"
              value={formData.unitsPerPackage}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="productStatus" className="text-[16px] text-gray-800 w-1/2 text-left">
              Product Status:
            </label>
            <select
              id="productStatus"
              name="productStatus"
              value={formData.productStatus}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="DISCONTINUED">DISCONTINUED</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="reorderLimitByPackage"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Reorder Limit By Package:
            </label>
            <input
              type="number"
              id="reorderLimitByPackage"
              name="reorderLimitByPackage"
              value={formData.reorderLimitByPackage}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
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
        </div>
      </div>
    </form>
  );
};

EditProductsForm.propTypes = {
  onUpdateProduct: PropTypes.func.isRequired,
};

export default EditProductsForm;