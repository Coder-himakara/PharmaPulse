import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTrucks } from "../../../../api/TruckApiService";

const TruckInfoTable = () => {
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch trucks from backend
  useEffect(() => {
    const fetchTrucks = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching trucks data...");
        const response = await getAllTrucks();
        console.log("Trucks response:", response);
        
        if (response.status === 200) {
          setTrucks(response.data.data || []);
          console.log("Trucks data loaded:", response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch trucks:", err);
        setError("Failed to load trucks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  // Filter trucks based on registration number search
  const filteredTrucks = trucks.filter((truck) =>
    (truck.registrationNumber || '').toLowerCase().includes(search.toLowerCase()),
  );

  // Sort trucks by date
  const sortedTrucks = filteredTrucks.sort((a, b) => {
    const dateA = new Date(a.dateAdded);
    const dateB = new Date(b.dateAdded);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleClose = () => {
    navigate('/admin-dashboard');
  };

  const handleEdit = (truckId) => {
    const truck = trucks.find((t) => t.truckId === truckId);
    navigate(`/admin-dashboard/edit-truck/${truckId}`, { state: { truck } });
  };

  const handleViewTruck = (truck) => {
    navigate(`/admin-dashboard/view-truck/${truck.truckId}`, {
      state: { truck },
    });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg relative'>
        <h1 className='p-1 m-1 text-2xl'>Truck Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1]'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='flex items-center justify-between p-2 m-2'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Trucks</h2>
        <input
          type='text'
          placeholder='Search by Registration Number...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
        />
      </div>

      {error && (
        <div className='text-red-600 text-center py-2 font-bold'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='text-center py-4'>Loading trucks data...</div>
      ) : (
        <>
          {sortedTrucks.length === 0 && (
            <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
              {search ? 'No trucks found matching your search.' : 'No trucks available.'}
            </div>
          )}

          {sortedTrucks.length > 0 && (
            <div className='p-2 m-2'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr>
                    <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                      Registration Number
                    </th>
                    <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                      Rep Name
                    </th>
                    <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                      Maximum Capacity
                    </th>
                    <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                      Status
                    </th>
                    <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTrucks.map((truck, index) => (
                    <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                      <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                        {truck.registrationNumber}
                      </td>
                      <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                        {truck.assignedRep}
                      </td>
                      <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                        {truck.maxCapacity}
                      </td>
                      <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                        <span className={`px-2 py-1 rounded ${
                          truck.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : truck.status === 'MAINTENANCE' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {truck.status}
                        </span>
                      </td>
                      <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                        <button
                          className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                          onClick={() => handleEdit(truck.truckId)}
                        >
                          Edit
                        </button>
                        <button
                          className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                          onClick={() => handleViewTruck(truck)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TruckInfoTable;
