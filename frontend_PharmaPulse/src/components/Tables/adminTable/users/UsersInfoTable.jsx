/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../../../api/AdminApiService";
import { toast } from "react-toastify";

const UsersInfoTable = ({ users: propUsers }) => {
  const [search, setSearch] = useState("");
  const [sortKey] = useState("dateOfJoined");
  const [sortDirection] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails();

        if (response?.data?.code === 200 && response?.data?.data) {
          // Transform the backend data to match our component's format
          const backendUsers = response.data.data.map(user => ({
            userId: user.userId.toString(), // Convert to string to match format
            username: user.username || "N/A",
            role: formatRole(user.role) || "N/A",
            status: user.status || "N/A",
            dateOfJoined: formatDate(user.dateOfJoined),
            // Keep all original data for edit/view operations
            originalData: user
          }));

          setUsers([...backendUsers, ...propUsers]);
        } else {
          toast.error("Failed to fetch users data");
          setUsers([...propUsers]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error loading users data");
        setUsers([...propUsers]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [propUsers]);

  // Format role to be more readable
  const formatRole = (role) => {
    if (!role) return "Unknown";

    // Convert SNAKE_CASE to Title Case
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Format date array [yyyy, mm, dd] to string "yyyy-mm-dd"
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "N/A";

    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortKey === "dateOfJoined") {
      const dateA = a.dateOfJoined !== "N/A" ? new Date(a.dateOfJoined) : new Date(0);
      const dateB = b.dateOfJoined !== "N/A" ? new Date(b.dateOfJoined) : new Date(0);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const handleClose = () => {
    navigate("/admin-dashboard");
  };

  const handleEdit = (userId) => {
    const user = users.find((u) => u.userId === userId);
    navigate(`/admin-dashboard/edit-user/${userId}`, { state: { user } });
  };

  const handleViewUser = (user) => {
    navigate(`/admin-dashboard/view-user/${user.userId}`, { state: { user } });
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg relative">
        <h1 className="p-1 m-1 text-2xl">Users Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1]"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Users</h2>
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
        />
      </div>

      {loading ? (
        <div className="text-center p-4">Loading users data...</div>
      ) : (
        <>
          {sortedUsers.length === 0 && search && (
            <div className="text-[#991919] text-sm text-center mt-2 font-bold">
              No users found matching your search.
            </div>
          )}

          <div className="p-2 m-2">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                    User ID
                  </th>
                  <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                    Username
                  </th>
                  <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                    Role
                  </th>
                  <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                    Status
                  </th>
                  <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {user.userId}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {user.username}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {user.role}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${user.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                          user.status === "INACTIVE" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      <button
                        className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                        onClick={() => handleEdit(user.userId)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                        onClick={() => handleViewUser(user)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

UsersInfoTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      dateOfJoined: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

UsersInfoTable.defaultProps = {
  users: [], // Default to empty array if not provided
};

export default UsersInfoTable;