/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AddProductsForm = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    purchaseGroupId: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field)) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("Product added successfully!");
    if (onAddProduct) {
      onAddProduct(formData);
    }
    setTimeout(() => {
      setFormData({
        purchaseGroupId: "",
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
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Add Products
      </h2>

      {errorMessage && <p className="text-[#991919] text-sm font-bold mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-[#3c5f3c] text-sm font-bold mb-4">{successMessage}</p>}

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-[16px] text-gray-800 mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1").replace("Id", " ID")}:
            </label>
            {key === "category" || key === "packageType" || key === "productStatus" ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="px-2 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="">Choose an option</option>
                {key === "category" && (
                  <>
                    <option value="MEDICINE">MEDICINE</option>
                    <option value="SURGICAL">SURGICAL</option>
                  </>
                )}
                {key === "packageType" && (
                  <>
                    <option value="VIAL">VIAL</option>
                    <option value="BOTTLE">BOTTLE</option>
                    <option value="BOX">BOX</option>
                    <option value="BLISTER PACK">BLISTER PACK</option>
                    <option value="POUCH">POUCH</option>
                  </>
                )}
                {key === "productStatus" && (
                  <>
                    <option value="active">ACTIVE</option>
                    <option value="inactive">INACTIVE</option>
                    <option value="discontinued">DISCONTINUED</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={key.includes("units") || key.includes("reorder") ? "number" : "text"}
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="px-2 py-2 text-sm border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-5">
        <button
          type="submit"
          className="px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]"
        >
          Add
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

AddProductsForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default AddProductsForm;
