import { useLocation, useNavigate } from 'react-router-dom';

const ViewLorryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lorry = location.state?.lorry;

  if (!lorry) {
    return (
      <div className='p-5 text-center text-red-500'>
        <h2>Lorry not found</h2>
        <button
          className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600'
          onClick={() => navigate('/lorry-info')}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md'>
      <h2 className='mb-4 text-xl font-bold text-center text-[var(--card-text-color)]'>
        Lorry Details
      </h2>
     
      <ul className='text-left '>
        <li>
          <strong>Lorry Id</strong> {lorry.lorryId}
        </li>
        <li>
          <strong>Number Plate:</strong> {lorry.numberPlate}
        </li>
        <li>
          <strong>Representative Id:</strong> {lorry.representativeId}
        </li>
        <li>
          <strong>Capacity:</strong> {lorry.capacity}
        </li>
        <li>
          <strong>Date Of Added:</strong> {lorry.dateOfAdded}
        </li>
        <li>
          <strong>Status:</strong> {lorry.status}
        </li>
        
      </ul>
      <div className='flex justify-center mt-4'>
        <button
          className='px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600'
          onClick={() => navigate('/lorry-info')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewLorryDetails ;
