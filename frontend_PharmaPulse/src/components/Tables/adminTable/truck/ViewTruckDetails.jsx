import { useLocation, useNavigate } from 'react-router-dom';

const ViewTruckDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const truck = location.state?.truck;

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
      <h2 className='mb-4 text-xl font-bold text-center text-[var(--card-text-color)] dark:text-black'>
        Truck Details
      </h2>

      <ul className='text-left '>
        <li>
          <strong>Truck Id:</strong> {truck.lorryId}
        </li>
        <li>
          <strong>Number Plate:</strong> {truck.numberPlate}
        </li>
        <li>
          <strong>Representative Id:</strong> {truck.representativeId}
        </li>
        <li>
          <strong>Capacity:</strong> {truck.capacity}
        </li>
        <li>
          <strong>Date Of Added:</strong> {truck.dateOfAdded}
        </li>
        <li>
          <strong>Status:</strong> {truck.status}
        </li>
      </ul>
      <div className='flex justify-center mt-4'>
        <button
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
          onClick={() => navigate('/admin-dashboard/truck-info')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewTruckDetails;
