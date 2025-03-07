/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { registerUsers } from '../../../../api/AdminApiService';

const AddUsersForm = ({ onAddUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    userId: "",
    nicNumber: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    dateOfJoined: "",
    role: "",
    status: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Form Validation 
    if (
      !formData.username ||
      !formData.userId ||
      !formData.nicNumber ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dateOfJoined ||
      !formData.role ||
      !formData.status
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (!/^0[0-9]{9}$/.test(formData.contactNumber)) {
      setErrorMessage(
        "Contact number must start with 0 and contain exactly 10 digits."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    const dataToSend = new FormData();

    // Add all form fields individually (not as a single JSON blob)
    Object.keys(formData).forEach(key => {
      // Don't send confirmPassword to the backend
      if (key !== 'confirmPassword') {
        dataToSend.append(key, formData[key]);
      }
    });

    // Add the image if it exists
    if (image) {
      dataToSend.append("imageFile", image);
    }
    // API Call to register users
    if (onAddUser) {
      registerUsers(dataToSend)
        .then((response) => {
          console.log("User registered successfully:", response.data);
          setSuccessMessage("Account created successfully!");
          // Reset form after successful submission
          setFormData({
            username: "",
            userId: "",
            nicNumber: "",
            email: "",
            contactNumber: "",
            address: "",
            password: "",
            confirmPassword: "",
            dateOfJoined: "",
            role: "", // Include role in reset
            status: "",
          });
          setImage(null);

          // Clear success message after delay
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          setErrorMessage(
            error.response?.data?.message ||
            "Registration failed. Please try again."
          );
        });
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg">
        Create Account
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

      {/* Form Grid Layout mimicking the invoice structure */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {[
            ["Username", "username", "text"],
            ["NIC Number", "nicNumber", "text"],
            ["Email", "email", "email"],
            ["Address", "address", "text"],
            ["Password", "password", "password"],
            ["Confirm Password", "confirmPassword", "password"],
          ].map(([label, name, type]) => (
            <div key={name} className="flex items-center">
              <label
                htmlFor={name}
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                {label}:
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Right Column with Buttons at the Bottom */}
        <div className="space-y-4">
          {[
            ["User ID", "userId", "text"],
            ["Contact Number", "contactNumber", "text"],
            ["Date of Joined", "dateOfJoined", "date"],
          ].map(([label, name, type]) => (
            <div key={name} className="flex items-center">
              <label
                htmlFor={name}
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                {label}:
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-1/2 px-2 py-2 text-sm border border-${name === "contactNumber" ? "red-300" : "gray-300"
                  } rounded-md`}
              />
            </div>
          ))}

          <div className="flex items-center">
            <label htmlFor="role" className="text-[16px] text-gray-800 w-1/2 text-left">
              Role:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a role</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="SALES_REP">Sales Representative</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="imageFile"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleFileChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="status" className="text-[16px] text-gray-800 w-1/2 text-left">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="">Choose a status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="LOCKED">Locked</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Buttons at Bottom-Right */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
            >
              Sign Up
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

AddUsersForm.propTypes = {
  onAddUser: PropTypes.func.isRequired,
};

export default AddUsersForm;