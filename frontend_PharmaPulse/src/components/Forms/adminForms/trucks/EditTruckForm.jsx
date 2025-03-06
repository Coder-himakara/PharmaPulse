/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditTruckForm = ({ onUpdateTruck }) => {
  const { state } = useLocation();
  const truck = state?.truck;

  const [formData, setFormData] = useState({
    numberPlate: "",
    representativeId: "",
    capacity: "",
    dateOfAdded: "",
    status: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (truck) {
      setFormData({
        numberPlate: truck.numberPlate || "",
        representativeId: truck.representativeId || "",
        capacity: truck.capacity || "",
        dateOfAdded: truck.dateOfAdded || "",
        status: truck.status || "",
      });
    }
  }, [truck]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.numberPlate ||
      !formData.representativeId ||
      !formData.capacity ||
      !formData.dateOfAdded ||
      !formData.status
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    if (onUpdateTruck) {
      onUpdateTruck(formData);
    }

    setSuccessMessage("Truck updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/truck-info");
    }, 2000);
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

      {[
        ["Number Plate", "numberPlate", "text"],
        ["Representative ID", "representativeId", "text"],
        ["Capacity(t)", "capacity", "number"],
        ["Date of Added", "dateOfAdded", "date"],
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
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-center gap-2 mt-5">
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

EditTruckForm.propTypes = {
  onUpdateTruck: PropTypes.func.isRequired,
};

export default EditTruckForm;