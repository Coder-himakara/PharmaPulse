/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditPurchaseGroupForm = ({ onUpdatePurchaseGroup }) => {
  const { state } = useLocation();
  const purchaseGroup = state?.purchaseGroup;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    purchaseGroupName: "",
    purchaseGroupAddress: "",
    purchaseGroupContactName: "",
    purchaseGroupPhoneNo: "",
    purchaseGroupFaxNo: "",
    purchaseGroupEmail: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Location state:", state);
    console.log("Received purchaseGroup:", purchaseGroup);

    if (!state || !purchaseGroup) {
      setErrorMessage("No purchase group data provided for editing.");
      setTimeout(() => navigate("/purchase-group-info"), 2000);
      return;
    }

    if (!purchaseGroup.purchaseGroupId) {
      setErrorMessage("Purchase group ID is missing in the provided data.");
      console.error("Purchase group object lacks purchaseGroupId:", purchaseGroup);
      setTimeout(() => navigate("/purchase-group-info"), 2000);
      return;
    }

    setFormData({
      purchaseGroupName: purchaseGroup.purchaseGroupName || "",
      purchaseGroupAddress: purchaseGroup.purchaseGroupAddress || "",
      purchaseGroupContactName: purchaseGroup.purchaseGroupContactName || "",
      purchaseGroupPhoneNo: purchaseGroup.purchaseGroupPhoneNo || "",
      purchaseGroupFaxNo: purchaseGroup.purchaseGroupFaxNo || "",
      purchaseGroupEmail: purchaseGroup.purchaseGroupEmail || "",
    });
  }, [purchaseGroup, state, navigate]);

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
      !formData.purchaseGroupName.trim() ||
      !formData.purchaseGroupAddress.trim() ||
      !formData.purchaseGroupContactName.trim() ||
      !formData.purchaseGroupPhoneNo.trim() ||
      !formData.purchaseGroupFaxNo.trim() ||
      !formData.purchaseGroupEmail.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const id = purchaseGroup.purchaseGroupId;
    if (!id) {
      setErrorMessage("Purchase group ID is missing. Cannot update without an ID.");
      return;
    }

    const requestData = {
      purchaseGroupName: formData.purchaseGroupName,
      purchaseGroupAddress: formData.purchaseGroupAddress,
      purchaseGroupContactName: formData.purchaseGroupContactName,
      purchaseGroupPhoneNo: formData.purchaseGroupPhoneNo,
      purchaseGroupFaxNo: formData.purchaseGroupFaxNo,
      purchaseGroupEmail: formData.purchaseGroupEmail,
    };

    try {
      const url = `http://localhost:8090/api/purchase-groups/update/${id}`;
      console.log("Sending PUT request to:", url);
      console.log("Request payload:", requestData);

      const response = await axios.put(url, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "admin",
          password: "admin123",
        },
      });

      console.log("Response:", response.data);
      setErrorMessage("");
      setSuccessMessage("Purchase Group updated successfully!");

      if (onUpdatePurchaseGroup) {
        onUpdatePurchaseGroup(response.data.data || response.data);
      }

      setTimeout(() => {
        console.log("Navigating back...");
        setSuccessMessage("");
        navigate("/purchase-group-info");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update purchase group";
      setErrorMessage(errorMsg);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  const handleCancel = () => {
    navigate("/employee-dashboard/purchase-group-info");
  };

  if (!state || !purchaseGroup || !purchaseGroup.purchaseGroupId) {
    return (
      <div className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md">
        <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
          Edit Purchase Group
        </h2>
        <div className="p-5 text-center text-red-600">
          {errorMessage || "Invalid purchase group data. Redirecting..."}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg">
        Edit Purchase Group
      </h2>

      {errorMessage && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-[#3c5f3c] text-sm font-bold mb-4 text-center">{successMessage}</p>
      )}

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupName"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Purchase Group Name:
        </label>
        <input
          type="text"
          id="purchaseGroupName"
          name="purchaseGroupName"
          value={formData.purchaseGroupName}
          className="w-2/3 px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
          readOnly
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupAddress"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Address:
        </label>
        <input
          type="text"
          id="purchaseGroupAddress"
          name="purchaseGroupAddress"
          value={formData.purchaseGroupAddress}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupContactName"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Contact Name:
        </label>
        <input
          type="text"
          id="purchaseGroupContactName"
          name="purchaseGroupContactName"
          value={formData.purchaseGroupContactName}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupPhoneNo"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Phone Number:
        </label>
        <input
          type="number"
          id="purchaseGroupPhoneNo"
          name="purchaseGroupPhoneNo"
          value={formData.purchaseGroupPhoneNo}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupFaxNo"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Fax:
        </label>
        <input
          type="text"
          id="purchaseGroupFaxNo"
          name="purchaseGroupFaxNo"
          value={formData.purchaseGroupFaxNo}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <label
          htmlFor="purchaseGroupEmail"
          className="text-[16px] text-gray-800 w-1/3 text-left"
        >
          Email:
        </label>
        <input
          type="email"
          id="purchaseGroupEmail"
          name="purchaseGroupEmail"
          value={formData.purchaseGroupEmail}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          required
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

EditPurchaseGroupForm.propTypes = {
  onUpdatePurchaseGroup: PropTypes.func.isRequired,
};

export default EditPurchaseGroupForm;