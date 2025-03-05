import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TruckInfoTable = ({ trucks }) => {
  const [search, setSearch] = useState('');
  const [sortDirection] = useState('asc');
  const navigate = useNavigate();

  const dummyTrucks = [
    
    {
      truckId: 'L001',
      numberPlate: 'ABC-1234',
      representativeId: 'R001',
      dateOfAdded: '2024-02-15',
    },
    {
      truckId: 'L002',
      numberPlate: 'XYZ-5678',
      representativeId: 'R002',
      dateOfAdded: '2024-02-18',
    },
    {
      truckId: 'L003',
      numberPlate: 'DEF-9101',
      representativeId: 'R003',
      dateOfAdded: '2024-02-20',
    },
  ];

  const combinedTrucks = [...dummyTrucks, ...trucks];

  const filteredTrucks = combinedTrucks.filter((truck) =>
    truck.numberPlate.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedTrucks = filteredTrucks.sort((a, b) => {
    const dateA = new Date(a.dateOfAdded);
    const dateB = new Date(b.dateOfAdded);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleClose = () => {
    navigate('/admin-dashboard');
  };

  const handleEdit = (truckId) => {
    const truck = combinedTrucks.find((l) => l.truckId === truckId);
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
          placeholder='Search by Number Plate...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
        />
      </div>

      {sortedTrucks.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No trucks found matching your search.
        </div>
      )}

      <div className='p-2 m-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Truck ID
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Number Plate
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Rep ID
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
                  {truck.truckId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {truck.numberPlate}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {truck.representativeId}
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
    </div>
  );
};

TruckInfoTable.propTypes = {
  trucks: PropTypes.arrayOf(
    PropTypes.shape({
      truckId: PropTypes.string.isRequired,
      numberPlate: PropTypes.string.isRequired,
      representativeId: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TruckInfoTable;
