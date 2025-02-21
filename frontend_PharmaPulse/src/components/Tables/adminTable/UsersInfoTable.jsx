/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UsersInfoTable = ({ users }) => {
  const [search, setSearch] = useState("");
  const [sortKey] = useState("dateOfJoined");
  const [sortDirection] = useState("asc");
  const navigate = useNavigate();

  const dummyUsers = [
    {
      userId: "U001",
      username: "john_doe",
      role: "Employee",
      dateOfJoined: "2024-01-10",
    },
    {
      userId: "U002",
      username: "jane_smith",
      role: "Employee",
      dateOfJoined: "2023-12-15",
    },
    {
      userId: "U003",
      username: "michael_brown",
      role: "Sales Representative",
      dateOfJoined: "2024-02-05",
    },
  ];

  const allUsers = [...users, ...dummyUsers];

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a[sortKey]);
    const dateB = new Date(b[sortKey]);
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleClose = () => {
    navigate("/admin-dashboard");
  };

  const handleEdit = (userId) => {
    const user = allUsers.find((u) => u.userId === userId);
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
    })
  ).isRequired,
};

export default UsersInfoTable;
