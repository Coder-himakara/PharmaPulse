/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AddProductsForm = ({ onAddProduct }) => {
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
  const [isRefIdGenerated, setIsRefIdGenerated] = useState(false); // Track if Ref ID is generated

  // Simulate backend data for the last product reference ID (e.g., "RepId003" for this example)
  const lastRefId = "RepId003"; // This would typically come from a backend API
  const getNextRefId = () => {
    const numericPart = parseInt(lastRefId.replace("RefId", ""), 10) || 0;
    const nextNumber = (numericPart + 1).toString().padStart(3, "0");
    return `RefId${nextNumber}`; // e.g., "RefId004"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenerateRefId = () => {
    if (!formData.purchaseGroup || isRefIdGenerated) return; // Prevent generating if no purchase group or already generated

    const newRefId = getNextRefId(); // Generate the next sequential ID
    setFormData((prevData) => ({
      ...prevData,
      productRefId: newRefId,
    }));
    setIsRefIdGenerated(true); // Mark as generated
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.purchaseGroup ||
      !formData.productRefId ||
      !formData.productName ||
      !formData.genericName ||
      !formData.description ||
      !formData.category ||
      !formData.packageType ||
      !formData.unitsPerPackage ||
      !formData.productStatus ||
      !formData.reorderLimitByPackage
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (!isRefIdGenerated) {
      setErrorMessage("Please generate a Product Ref Id before submitting.");
      return;
    }

    setErrorMessage(""); // Clear errors
    setSuccessMessage("Product added successfully!");

    if (onAddProduct) {
      onAddProduct(formData);
    }

    setTimeout(() => {
      setFormData({
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
      setSuccessMessage("");
      setIsRefIdGenerated(false); // Reset for a new product
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/employee-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Products
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">
          {successMessage}
        </p>
      )}

      {/* Form Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="purchaseGroup"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Purchase Group:
            </label>
            <select
              id="purchaseGroup"
              name="purchaseGroup"
              value={formData.purchaseGroup}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Select a Purchase Group</option>
              <option value="PG001">PG001</option>
              <option value="PG002">PG002</option>
              <option value="PG003">PG003</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="productName"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="genericName"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Generic Name:
            </label>
            <input
              type="text"
              id="genericName"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="description"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="category"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a category</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="SURGICAL">SURGICAL</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label
              htmlFor="productRefId"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Product Ref Id:
            </label>
            <div className="relative w-1/2">
              <input
                type="text"
                id="productRefId"
                name="productRefId"
                value={formData.productRefId}
                onChange={handleChange} // Disabled, but kept for form consistency
                disabled // Prevent editing of Product Ref Id
                className="w-full px-2 py-2 pr-20 text-sm border border-gray-300 rounded-md" // Increased padding-right for button overlap
              />
              <button
                type="button"
                onClick={handleGenerateRefId}
                disabled={!formData.purchaseGroup || isRefIdGenerated} // Disable if no purchase group or already generated
                className={`absolute right-0 top-0 px-3 py-2 text-white rounded-r-md text-[14px] cursor-pointer h-full ${
                  !formData.purchaseGroup || isRefIdGenerated
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2a4d69] hover:bg-[#00796b]"
                }`}
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="packageType"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Package Type:
            </label>
            <select
              id="packageType"
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
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
            <label
              htmlFor="unitsPerPackage"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Units Per Package:
            </label>
            <input
              type="number"
              id="unitsPerPackage"
              name="unitsPerPackage"
              value={formData.unitsPerPackage}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="productStatus"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Product Status:
            </label>
            <select
              id="productStatus"
              name="productStatus"
              value={formData.productStatus}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a status</option>
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
              <option value="discontinued">DISCONTINUED</option>
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
              className="w-1/2 px-2 py-2 text-sm border border-red-300 rounded-md"
            />
          </div>

          {/* Buttons at Bottom-Right */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
            >
              Add
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

AddProductsForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductsForm;