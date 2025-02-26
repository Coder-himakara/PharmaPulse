/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const EditUsersForm = ({ onUpdateUser }) => {
  const { state } = useLocation();
  const user = state?.user;

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    nicNumber: "",
    email: "",
    contactNumber: "",
    address: "",
    role: "",
    password: "",
    confirmPassword: "",
    dateOfJoined: "",
    lastLoginDate: "",
    profilePicture: null,
    status: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId || "",
        username: user.username || "",
        nicNumber: user.nicNumber || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        address: user.address || "",
        role: user.role || "",
        password: "",
        confirmPassword: "",
        dateOfJoined: user.dateOfJoined || "",
        lastLoginDate: user.lastLoginDate || "",
        profilePicture: user.profilePicture || null,
        status: user.status || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.contactNumber || !formData.role) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (!/^0[0-9]{9}$/.test(formData.contactNumber)) {
      setErrorMessage(
        "Contact number must start with 0 and contain exactly 10 digits."
      );
      return false;
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    if (onUpdateUser) {
      onUpdateUser(formData);
    }

    setSuccessMessage("User updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/users-info");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/admin-dashboard/users-info");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg">
        Edit User
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
            { label: "User ID", name: "userId", type: "text" },
            { label: "Username", name: "username", type: "text" },
            { label: "NIC Number", name: "nicNumber", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact Number", name: "contactNumber", type: "number" },
            { label: "Address", name: "address", type: "text" },
            { label: "Status", name: "status", type: "select" }, // Changed type to 'select' for consistency
          ].map(({ label, name, type }) => (
            <div key={name} className="flex items-center">
              <label
                htmlFor={name}
                className="text-[16px] text-gray-800 w-1/2 text-left"
              >
                {label}:
              </label>
              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value="">Choose a status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                  <option value="Suspended">Suspended</option>
                </select>
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-1/2 px-2 py-2 text-sm border border-${
                    name === "contactNumber" ? "red-300" : "gray-300"
                  } rounded-md`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right Column with Buttons at the Bottom */}
        <div className="space-y-4">
          {[
            { label: "Date of Joined", name: "dateOfJoined", type: "date" },
            { label: "Last Login Date", name: "lastLoginDate", type: "date" },
          ].map(({ label, name, type }) => (
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
              <option value="Employee">Employee</option>
              <option value="Sales Representative">Sales Representative</option>
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="profilePicture"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="password" className="text-[16px] text-gray-800 w-1/2 text-left">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              placeholder="Leave blank to keep existing password"
            />
          </div>

          <div className="flex items-center">
            <label
              htmlFor="confirmPassword"
              className="text-[16px] text-gray-800 w-1/2 text-left"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              placeholder="Leave blank to keep existing password"
            />
          </div>

          {/* Buttons at Bottom-Right */}
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

EditUsersForm.propTypes = {
  onUpdateUser: PropTypes.func.isRequired,
};

export default EditUsersForm;