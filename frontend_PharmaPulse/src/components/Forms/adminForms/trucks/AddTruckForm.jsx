/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { addTruck } from "../../../../api/InventoryApiService";

const AddTruckForm = ({ onAddTruck }) => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    assignedRep: "",
    maxCapacity: "",
    dateAdded: new Date().toISOString().split('T')[0],
    status: "ACTIVE"  // Default value
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Format date as M/d/yyyy for backend
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.registrationNumber ||
      !formData.assignedRep ||
      !formData.maxCapacity ||
      !formData.dateAdded ||
      !formData.status
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    // Format data exactly as backend expects it
    const truckData = {
      registrationNumber: formData.registrationNumber,
      assignedRep: formData.assignedRep,
      maxCapacity: parseInt(formData.maxCapacity),
      dateAdded: formatDate(formData.dateAdded),  // Format: M/d/yyyy
      status: formData.status
    };

    console.log("Submitting data:", truckData);

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await addTruck(truckData);

      if (response.status === 201) {
        setSuccessMessage("Truck added successfully!");
        if (onAddTruck) {
          onAddTruck(response.data.data);
        }

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            registrationNumber: "",
            assignedRep: "",
            maxCapacity: "",
            dateAdded: new Date().toISOString().split('T')[0],
            status: "ACTIVE",
          });
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to add truck. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg">
        Add Truck
      </h2>

      {errorMessage && (
        <p className="mb-4 text-sm font-bold text-center text-red-600">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-green-600">
          {successMessage}
        </p>
      )}

      {[
        ["Registration Number", "registrationNumber", "text", "HG-9689"],
        ["Representative Name", "assignedRep", "text", "Hashan"],
        ["Maximum Capacity (t)", "maxCapacity", "number", "1200"],
        ["Date Added", "dateAdded", "date"],
      ].map(([label, name, type, placeholder]) => (
        <div key={name} className="flex items-center justify-between mb-4">
          <label htmlFor={name} className="text-[16px] text-gray-800 w-2/3 text-left">
            {label}:
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            placeholder={placeholder}
            onChange={handleChange}
            className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
      ))}

      <div className="flex items-center justify-between mb-4">
        <label htmlFor="status" className="text-[16px] text-gray-800 w-2/3 text-left">
          Status:
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-2/3 px-2 py-2 text-sm border border-gray-300 rounded-md"
        >
          <option value="">Choose a status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:bg-gray-400"
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b] disabled:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

AddTruckForm.propTypes = {
  onAddTruck: PropTypes.func.isRequired,
};

export default AddTruckForm;