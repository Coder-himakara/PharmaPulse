import { useLocation, useNavigate } from 'react-router-dom';

const ViewUserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className='p-5 text-center text-red-500'>
        <h2>User not found</h2>
        <button
          className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600'
          onClick={() => navigate('/users-info')}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md'>
      <h2 className='mb-4 text-xl font-bold text-center text-[var(--card-text-color)]'>
        User Details
      </h2>
      <div className='flex items-center justify-center mb-4'>
        <img
          src={
            user.profilePicture
              ? URL.createObjectURL(user.profilePicture)
              : 'https://via.placeholder.com/80'
          }
          alt={user.username}
          className='w-20 h-20 border border-gray-300 rounded-full'
        />
      </div>
      <ul className='text-left '>
        <li>
          <strong>User ID:</strong> {user.userId}
        </li>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Contact:</strong> {user.contactNumber}
        </li>
        <li>
          <strong>NIC Number:</strong> {user.nicNumber}
        </li>
        <li>
          <strong>Address:</strong> {user.address}
        </li>
        <li>
          <strong>Role:</strong> {user.role}
        </li>
        <li>
          <strong>Username:</strong> {user.username}
        </li>
        <li>
          <strong>Password:</strong>
          {user.password}
        </li>
        
        <li>
          <strong>Date of Joined:</strong> {user.dateOfJoined}
        </li>
        <li>
          <strong>Last Join Date:</strong> {user.dateOfJoined}
        </li>
        <li>
          <strong>Status:</strong> {user.status}
        </li>
        
      </ul>
      <div className='flex justify-center mt-4'>
        <button
          className='px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600'
          onClick={() => navigate('/admin-dashboard/users-info')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewUserDetails;
