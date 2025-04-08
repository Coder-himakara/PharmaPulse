import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-[var(--card-bg-color)] to-green-400'>
      <div className='w-full max-w-md p-8 mx-4 bg-[var(--card-bg-color)] shadow-lg rounded-xl'>
        <div className='text-center'>
          <h1 className='mb-2 text-6xl font-bold text-red-500'>403</h1>
          <h2 className='mb-4 text-2xl font-semibold text-[var(--card-text-color)]'>
            Access Denied
          </h2>
          <p className='mb-8 text-[var(--text-color)]'>
            Sorry, you don&apos;t have permission to view this page.
          </p>
        </div>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button
            onClick={() => navigate(-1)}
            className='px-6 py-2 text-[var(--card-bg-color)] transition duration-200 transform bg-gray-600 rounded-lg hover:bg-gray-700 hover:-translate-y-1'
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className='px-6 py-2 text-[var(--card-bg-color)] transition duration-200 transform rounded-lg bg-[var(--card-text-color)] hover:bg-blue-800 hover:-translate-y-1'
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
