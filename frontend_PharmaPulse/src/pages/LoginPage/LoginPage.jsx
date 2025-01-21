import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simple login logic for demo purposes
    if (username === 'admin' && password === 'admin') {
      // Redirect to Employee Dashboard
      navigate('/employee-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-screen bg-center bg-no-repeat bg-cover'>
      <div className='flex flex-col items-center w-full max-w-md p-5 text-center bg-white rounded-lg shadow-lg bg-opacity-80'>
        <h1
          className='mb-5 text-2xl font-bold text-teal-900'
          style={{ fontSize: '24px', marginBottom: '20px' }}
        >
          Welcome to PharmaPulse
        </h1>
        <div className='w-full'>
          <h2 className='mb-5 text-lg font-medium text-gray-800'>Login</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='mb-4 text-left'>
              <label
                htmlFor='username'
                className='block mb-1 font-bold text-gray-600'
              >
                Username:
              </label>
              <input
                type='text'
                id='username'
                name='username'
                placeholder='Enter your username'
                required
                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-4 text-left'>
              <label
                htmlFor='password'
                className='block mb-1 font-bold text-gray-600'
              >
                Password:
              </label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your password'
                required
                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <NavLink
                to='/forgot-password'
                className='block mt-1 text-xs text-red-500 cursor-pointer hover:underline'
              >
                Forgot Password?
              </NavLink>
            </div>
            <button
              type='submit'
              className='w-full py-2 bg-teal-700 text-white rounded-md cursor-pointer hover:bg-[#003d33]'
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
