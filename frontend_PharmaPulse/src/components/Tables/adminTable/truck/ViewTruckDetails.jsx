import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTruckById } from '../../../../api/TruckApiService';

const ViewTruckDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { truckId } = useParams();
  const [truck, setTruck] = useState(location.state?.truck || null);
  const [isLoading, setIsLoading] = useState(!location.state?.truck);
  const [error, setError] = useState(null);

  // Format date for display - handles both date strings and arrays [year, month, day]
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';

    try {
      // Handle array format from Java LocalDate
      if (Array.isArray(dateInput)) {
        const [year, month, day] = dateInput;
        const date = new Date(year, month - 1, day); // Month is zero-based in JS Date
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }

      // Handle string format
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }

      return String(dateInput);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // If truck isn't passed via location state, fetch it by ID
  useEffect(() => {
    if (!location.state?.truck && truckId) {
      const fetchTruckById = async () => {
        setIsLoading(true);
        try {
          const response = await getTruckById(truckId);
          if (response.status === 200) {
            setTruck(response.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch truck details:', err);
          setError('Failed to load truck details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTruckById();
    }
  }, [truckId, location.state]);

  if (isLoading) {
    return (
      <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
        <p className='text-center'>Loading truck details...</p>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
        <p className='text-center text-red-600'>{error || 'Truck not found'}</p>
        <div className='flex justify-center mt-4'>
          <button
            className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
            onClick={() => navigate('/admin-dashboard/truck-info')}
          >
            Back to Trucks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md'>
      <h2 className='mb-6 text-xl font-bold text-center text-[#1a5353]'>
        Truck Details
      </h2>

      <ul className='space-y-3 text-left'>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Truck ID:</strong>{' '}
          <span className='float-right'>{truck.id || 'N/A'}</span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Registration Number:</strong>{' '}
          <span className='float-right'>
            {truck.registrationNumber || 'N/A'}
          </span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Representative:</strong>{' '}
          <span className='float-right'>{truck.assignedRep || 'N/A'}</span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Maximum Capacity:</strong>{' '}
          <span className='float-right'>{truck.maxCapacity || 'N/A'} kg</span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Current Capacity:</strong>{' '}
          <span className='float-right'>{truck.currentCapacity || '0'} kg</span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Date Added:</strong>{' '}
          <span className='float-right'>{formatDate(truck.dateAdded)}</span>
        </li>
        <li className='p-2 bg-white rounded-md shadow-sm'>
          <strong>Status:</strong>
          <span
            className={`float-right px-2 py-1 rounded ${
              truck.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : truck.status === 'MAINTENANCE'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {truck.status || 'N/A'}
          </span>
        </li>
      </ul>

      <div className='flex justify-center gap-4 mt-6'>
        <button
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
          onClick={() => navigate('/admin-dashboard/truck-info')}
        >
          Back to Trucks
        </button>
        <button
          className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
          onClick={() =>
            navigate(`/admin-dashboard/edit-truck/${truck.id}`, {
              state: { truck },
            })
          }
        >
          Edit Truck
        </button>
      </div>
    </div>
  );
};

export default ViewTruckDetails;
