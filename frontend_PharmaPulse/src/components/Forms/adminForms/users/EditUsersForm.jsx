/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUserDetails } from "../../../../api/AdminApiService";

const EditUsersForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Get user from navigation state or original data if it exists
  const userData = state?.user;
  const user = userData?.originalData || userData;

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Format date array [yyyy, mm, dd] to string "YYYY-MM-DD" for date input fields
  const formatDateForInput = (dateArray) => {
    if (!dateArray) return "";
    if (typeof dateArray === "string") return dateArray;
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    return "";
  };

  useEffect(() => {
    if (user) {
      console.log("User data received:", user);
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
        dateOfJoined: formatDateForInput(user.dateOfJoined) || "",
        lastLoginDate: formatDateForInput(user.lastLoginDate) || "",
        profilePicture: null, // Reset profile picture on load
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    console.log("Form data before submission:", formData);

    // Basic validation for required fields
    if (!formData.email || !formData.contactNumber || !formData.role) {
      setErrorMessage("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }
    if (!/^0[0-9]{9}$/.test(formData.contactNumber)) {
      setErrorMessage("Contact number must start with 0 and contain exactly 10 digits.");
      setIsSubmitting(false);
      return;
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Append all fields - matching the UsersDTO property names exactly
      formDataObj.append("username", formData.username);
      formDataObj.append("nicNumber", formData.nicNumber || "");
      formDataObj.append("email", formData.email);
      formDataObj.append("contactNumber", formData.contactNumber);
      formDataObj.append("address", formData.address || "");
      formDataObj.append("role", formData.role);
      formDataObj.append("status", formData.status || "");

      // Handle date as string - Spring will convert to LocalDate
      if (formData.dateOfJoined) {
        formDataObj.append("dateOfJoined", formData.dateOfJoined);
      }

      // Only include password if provided
      if (formData.password && formData.password.trim() !== "") {
        formDataObj.append("password", formData.password);
      }

      // Handle image file - must match controller parameter name
      if (formData.profilePicture instanceof File) {
        formDataObj.append("imageFile", formData.profilePicture);
      }

      console.log("Sending form data to backend...");

      // Get user ID from params or form data
      const userIdToUpdate = userId || formData.userId;

      // Call API to update user
      const response = await updateUserDetails(userIdToUpdate, formDataObj);

      console.log("Backend response:", response);

      if (!response || !response.data || response.data.code !== 200) {
        throw new Error(response?.data?.message || "Failed to update user");
      }

      setSuccessMessage("User updated successfully!");
      toast.success("User updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin-dashboard/users-info");
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage(error.message || "Failed to update user. Please try again.");
      toast.error(error.message || "Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        Edit User: {formData.username}
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
            <label htmlFor="userId" className="text-[16px] text-gray-800 w-1/2 text-left">
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              readOnly
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="username" className="text-[16px] text-gray-800 w-1/2 text-left">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="nicNumber" className="text-[16px] text-gray-800 w-1/2 text-left">
              NIC Number:
            </label>
            <input
              type="text"
              id="nicNumber"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="email" className="text-[16px] text-gray-800 w-1/2 text-left">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="contactNumber" className="text-[16px] text-gray-800 w-1/2 text-left">
              Contact Number:
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="address" className="text-[16px] text-gray-800 w-1/2 text-left">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
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
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="dateOfJoined" className="text-[16px] text-gray-800 w-1/2 text-left">
              Date of Joined:
            </label>
            <input
              type="date"
              id="dateOfJoined"
              name="dateOfJoined"
              value={formData.dateOfJoined}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="lastLoginDate" className="text-[16px] text-gray-800 w-1/2 text-left">
              Last Login Date:
            </label>
            <input
              type="date"
              id="lastLoginDate"
              name="lastLoginDate"
              value={formData.lastLoginDate}
              onChange={handleChange}
              className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-md"
              readOnly
            />
          </div>
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
              required
            >
              <option value="">Choose a role</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="SALES_REP">Sales Representative</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="profilePicture" className="text-[16px] text-gray-800 w-1/2 text-left">
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
            <label htmlFor="confirmPassword" className="text-[16px] text-gray-800 w-1/2 text-left">
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
              disabled={isSubmitting}
              className={`px-5 py-2 ${isSubmitting ? "bg-gray-400" : "bg-[#2a4d69] hover:bg-[#00796b]"} text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300`}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
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
  onUpdateUser: PropTypes.func,
};

export default EditUsersForm;