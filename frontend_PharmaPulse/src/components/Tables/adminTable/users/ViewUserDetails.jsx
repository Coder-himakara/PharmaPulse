import { useLocation, useNavigate } from 'react-router-dom';

const ViewUserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from navigation state, with originalData if it exists
  const userData = location.state?.user;
  // Use the original backend data if available, otherwise use the passed user data
  const user = userData?.originalData || userData;

  // Format date array [yyyy, mm, dd] to string "YYYY-MM-DD"
  const formatDate = (dateArray) => {
    if (!dateArray) return 'Not available';

    // If it's already a formatted string, return it
    if (typeof dateArray === 'string') return dateArray;

    // If it's an array in [yyyy, mm, dd] format, format it
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    return 'Invalid date format';
  };

  // Format role to be more readable
  const formatRole = (role) => {
    if (!role) return 'Not specified';

    // If already formatted, return as is
    if (role.includes(' ')) return role;

    // Convert SNAKE_CASE to Title Case
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (!user) {
    return (
      <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-center text-red-600'>
          Error: User data not found
        </h2>
        <div className='flex justify-center mt-4'>
          <button
            className='px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600'
            onClick={() => navigate('/admin-dashboard/users-info')}
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
      <h2 className='mb-4 text-xl font-bold text-center text-[#1a5353]'>
        User Details
      </h2>

      <div className='flex items-center justify-center mb-6'>
        <div className='p-1 border-2 border-[#1a5353] rounded-full'>
          <img
            src={
              user.profilePicture
                ? URL.createObjectURL(user.profilePicture)
                : 'https://via.placeholder.com/80'
            }
            alt={user.username || 'User'}
            className='w-24 h-24 rounded-full'
          />
        </div>
      </div>

      <div className='p-4 bg-white rounded-md shadow-sm'>
        <ul className='space-y-3'>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>User ID:</span>
            <span className='w-2/3'>{user.userId}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>
              Username:
            </span>
            <span className='w-2/3'>{user.username || 'Not set'}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>Email:</span>
            <span className='w-2/3'>{user.email || 'Not provided'}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>Contact:</span>
            <span className='w-2/3'>
              {user.contactNumber || 'Not provided'}
            </span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>
              NIC Number:
            </span>
            <span className='w-2/3'>{user.nicNumber || 'Not provided'}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>Address:</span>
            <span className='w-2/3'>{user.address || 'Not provided'}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>Role:</span>
            <span className='w-2/3'>{formatRole(user.role)}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>
              Date Joined:
            </span>
            <span className='w-2/3'>{formatDate(user.dateOfJoined)}</span>
          </li>
          <li className='flex'>
            <span className='w-1/3 font-semibold text-[#1a5353]'>Status:</span>
            <span
              className={`w-2/3 px-2 py-1 text-sm rounded-full inline-block text-center
              ${
                user.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : user.status === 'INACTIVE'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.status || 'Unknown'}
            </span>
          </li>
        </ul>
      </div>

      <div className='flex justify-between mt-6'>
        <button
          className='px-4 py-2 text-white bg-[#4c85a6] rounded-md hover:bg-[#15375c]'
          onClick={() => navigate('/admin-dashboard/users-info')}
        >
          Back to Users
        </button>

        <button
          className='px-4 py-2 text-white bg-[#4c85a6] rounded-md hover:bg-[#15375c]'
          onClick={() =>
            navigate(`/admin-dashboard/edit-user/${user.userId}`, {
              state: { user },
            })
          }
        >
          Edit User
        </button>
      </div>
    </div>
  );
};

export default ViewUserDetails;
