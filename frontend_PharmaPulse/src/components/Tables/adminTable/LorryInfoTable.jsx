import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const LorryInfoTable = ({ lorries }) => {
  const [search, setSearch] = useState('');
  const [sortDirection] = useState('asc');
  const navigate = useNavigate();

  const dummyLorries = [
    {
      lorryId: 'L001',
      numberPlate: 'ABC-1234',
      representativeId: 'R001',
      dateOfAdded: '2024-02-15',
    },
    {
      lorryId: 'L002',
      numberPlate: 'XYZ-5678',
      representativeId: 'R002',
      dateOfAdded: '2024-02-18',
    },
    {
      lorryId: 'L003',
      numberPlate: 'DEF-9101',
      representativeId: 'R003',
      dateOfAdded: '2024-02-20',
    },
  ];

  const combinedLorries = [...dummyLorries, ...lorries];

  const filteredLorries = combinedLorries.filter((lorry) =>
    lorry.numberPlate.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedLorries = filteredLorries.sort((a, b) => {
    const dateA = new Date(a.dateOfAdded);
    const dateB = new Date(b.dateOfAdded);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleClose = () => {
    navigate('/admin-dashboard');
  };

  const handleEdit = (lorryId) => {
    const lorry = combinedLorries.find((l) => l.lorryId === lorryId);
    navigate(`/admin-dashboard/edit-truck/${lorryId}`, { state: { lorry } });
  };

  const handleViewLorry = (lorry) => {
    navigate(`/admin-dashboard/view-truck/${lorry.lorryId}`, { state: { lorry } });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg relative'>
        <h1 className='p-1 m-1 text-2xl'>Lorry Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1]'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='flex items-center justify-between p-2 m-2'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Lorries</h2>
        <input
          type='text'
          placeholder='Search by Number Plate...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
        />
      </div>

      {sortedLorries.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No lorries found matching your search.
        </div>
      )}

      <div className='p-2 m-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Lorry ID
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
            {sortedLorries.map((lorry, index) => (
              <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {lorry.lorryId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {lorry.numberPlate}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {lorry.representativeId}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleEdit(lorry.lorryId)}
                  >
                    Edit
                  </button>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleViewLorry(lorry)}
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

LorryInfoTable.propTypes = {
  lorries: PropTypes.arrayOf(
    PropTypes.shape({
      lorryId: PropTypes.string.isRequired,
      numberPlate: PropTypes.string.isRequired,
      representativeId: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default LorryInfoTable;
