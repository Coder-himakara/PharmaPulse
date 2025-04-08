/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getTruckById, updateTruck } from '../../../../api/TruckApiService';

const EditTruckForm = ({ onUpdateTruck }) => {
  const { state } = useLocation();
  const { truckId } = useParams();
  const truck = state?.truck;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    assignedRep: "",
    maxCapacity: "",
    dateAdded: "",
    status: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Format date for display in the form (YYYY-MM-DD)
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Handle different date formats that might come from the backend
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing M/d/yyyy format
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const [month, day, year] = parts;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return "";
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return "";
    }
  };

  // Format date for backend (M/d/yyyy)
  const formatBackendDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } catch (error) {
      console.error("Error formatting date for backend:", error);
      return "";
    }
  };

  useEffect(() => {
    if (truck) {
      console.log("Using truck data from state:", truck);
      setFormData({
        registrationNumber: truck.registrationNumber || "",
        assignedRep: truck.assignedRep || "",
        maxCapacity: truck.maxCapacity || "",
        dateAdded: formatDisplayDate(truck.dateAdded) || "",
        status: truck.status || "",
      });
    } else if (truckId) {
      console.log("Fetching truck data for ID:", truckId);
      fetchTruckData(truckId);
    }
  }, [truck, truckId]);

  const fetchTruckData = async (id) => {
    try {
      setIsLoading(true);
      console.log(`Fetching truck with ID: ${id}...`);
      const response = await getTruckById(id);
      console.log("Truck data received:", response.data);
      
      if (response.status === 200) {
        const truckData = response.data.data;
        setFormData({
          registrationNumber: truckData.registrationNumber || "",
          assignedRep: truckData.assignedRep || "",
          maxCapacity: truckData.maxCapacity || "",
          dateAdded: formatDisplayDate(truckData.dateAdded) || "",
          status: truckData.status || "",
        });
        console.log("Form data set:", formData);
      }
    } catch (error) {
      console.error("Error fetching truck data:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to fetch truck data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.registrationNumber) {
      setErrorMessage("Registration number is required");
      return false;
    }
    
    if (!formData.assignedRep) {
      setErrorMessage("Representative name is required");
      return false;
    }
    
    if (!formData.maxCapacity || parseFloat(formData.maxCapacity) <= 0) {
      setErrorMessage("Maximum capacity must be a positive number");
      return false;
    }
    
    if (!formData.dateAdded) {
      setErrorMessage("Date added is required");
      return false;
    }
    
    if (!formData.status) {
      setErrorMessage("Please select a status");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format data for backend
    const truckData = {
      registrationNumber: formData.registrationNumber,
      assignedRep: formData.assignedRep,
      maxCapacity: parseInt(formData.maxCapacity),
      dateAdded: formatBackendDate(formData.dateAdded),
      status: formData.status
    };

    console.log("Submitting truck update:", truckData);
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Make API call to update truck
      const response = await updateTruck(truckId, truckData);
      console.log("Update response:", response);
      
      if (response.status === 201) {
        setSuccessMessage("Truck updated successfully!");
        if (onUpdateTruck) {
          onUpdateTruck(response.data.data);
        }

        // Navigate back after successful update
        setTimeout(() => {
          navigate("/admin-dashboard/truck-info");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to update truck. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard/truck-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-w-md mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg">
        Edit Truck
      </h2>

      {errorMessage && (
        <p className="mb-4 text-sm font-bold text-center text-red-600">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm font-bold text-center text-green-600">
          {successMessage}
        </p>
      )}

      {isLoading ? (
        <p className="text-center">Loading truck data...</p>
      ) : (
        <>
          {[
            ["Registration Number", "registrationNumber", "text"],
            ["Representative Name", "assignedRep", "text"],
            ["Maximum Capacity (t)", "maxCapacity", "number"],
            ["Date Added", "dateAdded", "date"],
          ].map(([label, name, type]) => (
            <div key={name} className="flex items-center justify-between mb-4">
              <label htmlFor={name} className="text-[16px] text-gray-800 w-2/3 text-left">
                {label}:
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
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
              {isLoading ? "Updating..." : "Update"}
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
        </>
      )}
    </form>
  );
};

EditTruckForm.propTypes = {
  onUpdateTruck: PropTypes.func.isRequired,
};

export default EditTruckForm;