import { useLocation, useNavigate } from 'react-router-dom';

const ViewUserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className="text-center text-red-500 p-5">
        <h2>User not found</h2>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate('/users-info')}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        User Details
      </h2>
      <div className="flex items-center justify-center mb-4">
        <img
          src={user.profilePicture ? URL.createObjectURL(user.profilePicture) : 'https://via.placeholder.com/80'}
          alt={user.username}
          className="w-20 h-20 rounded-full border border-gray-300"
        />
      </div>
      <ul className="text-gray-700">
        <li><strong>User ID:</strong> {user.userId}</li>
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Contact:</strong> {user.contactNumber}</li>
        <li><strong>NIC Number:</strong> {user.nicNumber}</li>
        <li><strong>Address:</strong> {user.address}</li>
        <li><strong>Date of Joined:</strong> {user.dateOfJoined}</li>
        <li><strong>Password:</strong>{user.password}</li>
        <li><strong>Role:</strong> {user.role}</li>
      </ul>
      <div className="flex justify-center mt-4">
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          onClick={() => navigate('/users-info')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewUserDetails;
