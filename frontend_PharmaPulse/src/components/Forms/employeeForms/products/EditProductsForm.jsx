/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { updateProducts, getAllPurchaseGroups } from "../../../../api/EmployeeApiService";

const EditProductsForm = ({ onUpdateProduct }) => {
  const { state } = useLocation();
  const product = state?.product;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseGroupId: "",
    productRefId: "",
    productName: "",
    genericName: "",
    description: "",
    category: "",
    packageType: "",
    unitsPerPack: "",
    productStatus: "",
    reorderLimitByPackage: "",
  });

  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await getAllPurchaseGroups();
        setPurchaseGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching purchase groups:", error);
        setErrorMessage("Failed to fetch purchase groups.");
      }
    };
    fetchPurchaseGroups();
  }, []);

  useEffect(() => {
    if (!product || !product.productId) {
      setErrorMessage("No product data provided for editing.");
      navigate("/employee-dashboard/products-info");
      return;
    }
    setFormData({
      purchaseGroupId: product.purchaseGroupId?.toString() || "",
      productRefId: product.productRefId || "",
      productName: product.productName || "",
      genericName: product.genericName || "",
      description: product.description || "",
      category: product.category || "",
      packageType: product.packageType || "",
      unitsPerPack: product.unitsPerPack || "",
      productStatus: product.productStatus || "",
      reorderLimitByPackage: product.reorderLimitByPackage?.toString() || "",
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
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const requiredFields = [
      "purchaseGroupId", "productRefId", "productName", "genericName",
      "description", "category", "packageType", "unitsPerPack",
      "productStatus", "reorderLimitByPackage"
    ];
    if (requiredFields.some(field => !formData[field].trim())) {
      setErrorMessage("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    const productId = product?.productId;
    if (!productId) {
      setErrorMessage("Product ID is missing. Cannot update without an ID.");
      setIsLoading(false);
      return;
    }

    const purchaseGroupId = parseInt(formData.purchaseGroupId, 10);
    const reorderLimit = parseInt(formData.reorderLimitByPackage, 10);

    if (isNaN(purchaseGroupId) || isNaN(reorderLimit)) {
      setErrorMessage("Please ensure numeric fields contain valid numbers.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      purchaseGroupId,
      productRefId: formData.productRefId,
      productName: formData.productName,
      genericName: formData.genericName,
      description: formData.description,
      category: formData.category.toUpperCase(),
      packageType: formData.packageType.toUpperCase(),
      unitsPerPack: formData.unitsPerPack,
      productStatus: formData.productStatus.toUpperCase(),
      reorderLimitByPackage: reorderLimit,
    };

    try {
      const response = await updateProducts(productId, requestData);
      const updatedProduct = response.data.data || response.data;

      setSuccessMessage("Product updated successfully!");
      setShowPopup(true);
      
      if (onUpdateProduct) {
        onUpdateProduct(updatedProduct);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/products-info");
  };
  
  const handlePopupContinue = () => {
    setShowPopup(false);
    navigate("/employee-dashboard/products-info");
  };

  if (!product || !product.productId) {
    return (
      <div className="p-5 text-center text-red-600">
        {errorMessage || "Invalid product data"}
      </div>
    );
  }

  return (
    <div className="relative">
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
        {successMessage && !showPopup && (
          <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Left column form fields - unchanged */}
            <div className="flex items-center">
              <label htmlFor="purchaseGroupId" className="text-[16px] text-gray-800 w-1/2 text-left">
                Purchase Group:
              </label>
              <select
                id="purchaseGroupId"
                name="purchaseGroupId"
                value={formData.purchaseGroupId}
                onChange={handleChange}
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Purchase Group</option>
                {purchaseGroups.map(group => (
                  <option key={group.purchaseGroupId} value={group.purchaseGroupId}>
                    {group.purchaseGroupName} (ID: {group.purchaseGroupId})
                  </option>
                ))}
              </select>
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
                <option value="MEDICINE">Medicine</option>
                <option value="SURGICAL">Surgical</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {/* Right column form fields - unchanged */}
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
                <option value="">Choose a package type</option>
                <option value="VIAL">Vial</option>
                <option value="BOTTLE">Bottle</option>
                <option value="BOX">Box</option>
                <option value="BLISTER_PACK">Blister Pack</option>
                <option value="POUCH">Pouch</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="unitsPerPack" className="text-[16px] text-gray-800 w-1/2 text-left">
                Units Per Package:
              </label>
              <input
                type="text"
                id="unitsPerPack"
                name="unitsPerPack"
                value={formData.unitsPerPack}
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="reorderLimitByPackage" className="text-[16px] text-gray-800 w-1/2 text-left">
                Reorder Limit:
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
                disabled={isLoading}
                className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update"}
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

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
            {/* Orange Checkmark Circle */}
            <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
              <div className="p-4 bg-orange-500 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="mt-8 text-xl font-bold text-gray-800">SUCCESS</h3>
            <p className="mt-2 text-sm text-gray-600">
              Product updated successfully!
            </p>

            {/* Continue Button */}
            <button
              onClick={handlePopupContinue}
              className="px-6 py-2 mt-4 text-white transition-all duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EditProductsForm.propTypes = {
  onUpdateProduct: PropTypes.func,
};

EditProductsForm.defaultProps = {
  onUpdateProduct: () => {},
};

export default EditProductsForm;