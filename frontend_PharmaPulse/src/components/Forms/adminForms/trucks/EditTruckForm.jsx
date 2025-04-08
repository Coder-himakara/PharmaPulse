/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from "react";
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

  // Keep track of the original truck data
  const [originalTruckData, setOriginalTruckData] = useState(null);

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Format date for display in the form (YYYY-MM-DD)
  const formatDisplayDate = useCallback((dateInput) => {
    if (!dateInput) return "";

    try {
      // If dateInput is an array (from Java LocalDate/LocalDateTime)
      if (Array.isArray(dateInput)) {
        // Extract year, month, day from the array
        const [year, month, day] = dateInput;
        // Month is 1-indexed in the array but needs to be zero-padded
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      // Handle string date format
      if (typeof dateInput === 'string') {
        // Try parsing M/d/yyyy format
        if (dateInput.includes('/')) {
          const parts = dateInput.split('/');
          if (parts.length === 3) {
            const [month, day, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Try standard date parsing
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }

      // If dateInput is a valid date object
      if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
        return dateInput.toISOString().split("T")[0];
      }

      console.warn("Unable to parse date format:", dateInput);
      return "";
    } catch (error) {
      console.error("Error formatting date for display:", error, "Date input was:", dateInput);
      return "";
    }
  }, []);

  // Format date for backend - matching LocalDateTime expected format
  const formatBackendDate = useCallback((dateInput) => {
    if (!dateInput) return null;

    try {
      // If it's a YYYY-MM-DD formatted date (from HTML date input)
      if (typeof dateInput === 'string' && dateInput.includes('-')) {
        const [year, month, day] = dateInput.split('-').map(Number);
        // Return the date as array format for LocalDateTime [year, month, day, 0, 0]
        return [year, month, day, 0, 0];
      }

      // If dateInput is already an array, ensure it has the right format
      if (Array.isArray(dateInput)) {
        // If it's missing hours and minutes, add them
        if (dateInput.length === 3) {
          return [...dateInput, 0, 0];
        }
        return dateInput;
      }

      // If it's an M/d/yyyy formatted date string
      if (typeof dateInput === 'string' && dateInput.includes('/')) {
        const parts = dateInput.split('/');
        if (parts.length === 3) {
          const [month, day, year] = parts.map(Number);
          return [year, month, day, 0, 0];
        }
      }

      // Handle other string formats or Date objects
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return [
          date.getFullYear(),
          date.getMonth() + 1, // Month is 0-indexed in JS Date
          date.getDate(),
          0,  // Hours
          0   // Minutes
        ];
      }

      console.warn("Unable to format date for backend:", dateInput);
      return null;
    } catch (error) {
      console.error("Error formatting date for backend:", error, "Date input was:", dateInput);
      return null;
    }
  }, []);

  const fetchTruckData = useCallback(async (id) => {
    try {
      setIsLoading(true);
      console.log(`Fetching truck with ID: ${id}...`);
      const response = await getTruckById(id);
      console.log("Truck data received:", response.data);

      if (response.status === 200) {
        const truckData = response.data.data;
        setOriginalTruckData(truckData);

        const newFormData = {
          registrationNumber: truckData.registrationNumber || "",
          assignedRep: truckData.assignedRep || "",
          maxCapacity: truckData.maxCapacity || "",
          dateAdded: formatDisplayDate(truckData.dateAdded) || "",
          status: truckData.status || "",
        };
        setFormData(newFormData);
        console.log("Form data set:", newFormData);
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
  }, [formatDisplayDate]);

  useEffect(() => {
    console.log("Current truckId from params:", truckId);
    console.log("Truck from state:", truck);

    if (truck) {
      console.log("Using truck data from state");
      console.log("Date type:", typeof truck.dateAdded, Array.isArray(truck.dateAdded) ? "is array" : "not array");
      console.log("Date value:", truck.dateAdded);

      try {
        // Store original truck data
        setOriginalTruckData(truck);

        setFormData({
          registrationNumber: truck.registrationNumber || "",
          assignedRep: truck.assignedRep || "",
          maxCapacity: truck.maxCapacity || "",
          dateAdded: formatDisplayDate(truck.dateAdded) || "",
          status: truck.status || "",
        });
        console.log("Formatted date result:", formatDisplayDate(truck.dateAdded));
      } catch (error) {
        console.error("Error setting form data:", error);
      }
    }
    else if (truckId && truckId !== "undefined") {
      console.log("Fetching truck data for ID:", truckId);
      fetchTruckData(truckId);
    }
    else if (truck && truck.id) {
      console.log("Using ID from truck state:", truck.id);
      fetchTruckData(truck.id);
    }
    else {
      setErrorMessage("No valid truck ID provided. Please select a truck from the list.");
    }
  }, [truck, truckId, fetchTruckData, formatDisplayDate]);

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

    // Get the truck ID from either URL params, truck object, or original truck data
    const effectiveTruckId = truckId || truck?.id || originalTruckData?.id;

    // Validate truckId is available and valid
    if (!effectiveTruckId) {
      setErrorMessage("Invalid truck ID. Please try again or go back to the truck list.");
      return;
    }

    // Format data to match TruckResponseDTO structure
    const truckData = {
      id: Number(effectiveTruckId),
      registrationNumber: formData.registrationNumber,
      assignedRep: formData.assignedRep,
      // Ensure numeric fields are sent as integers, not strings
      maxCapacity: parseInt(formData.maxCapacity, 10),
      dateAdded: formatBackendDate(formData.dateAdded),
      status: formData.status,
      // Ensure currentCapacity is an integer
      currentCapacity: originalTruckData?.currentCapacity !== undefined
        ? parseInt(originalTruckData.currentCapacity, 10)
        : 0
    };

    console.log("Submitting truck update:", truckData);
    console.log("Truck ID for update:", effectiveTruckId);
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Make API call to update truck - ensure truckId is a number
      const numericTruckId = parseInt(effectiveTruckId, 10);
      if (isNaN(numericTruckId)) {
        throw new Error("Truck ID must be a valid number");
      }

      // Debug the exact payload being sent
      console.log("Payload to be sent:", JSON.stringify(truckData));

      const response = await updateTruck(numericTruckId, truckData);
      console.log("Update response:", response);

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Truck updated successfully!");
        if (onUpdateTruck && response.data.data) {
          onUpdateTruck(response.data.data);
        }

        // Navigate back after successful update
        setTimeout(() => {
          navigate("/admin-dashboard/truck-info");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating truck:", error);

      // Enhanced error reporting
      const errorDetails = error.response?.data?.details || error.message;
      const errorMessage = error.response?.data?.message || "Failed to update truck";

      console.error("Error details:", errorDetails);

      setErrorMessage(
        `${errorMessage}. ${errorDetails}`
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
            ["Maximum Capacity (kg)", "maxCapacity", "number"],
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