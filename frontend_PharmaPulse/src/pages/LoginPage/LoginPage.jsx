import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../security/UseAuth';

// If the image is in src/assets, import it like this:
// import loginBg from '../assets/loginbg.webp'; // Adjust path as needed

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get authentication state and methods from context
  const { login, isAuthenticated, role } = useAuth();

  // Handle redirection after successful login
  useEffect(() => {
    if (isAuthenticated && role) {
      switch (role) {
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'EMPLOYEE':
          navigate('/employee-dashboard');
          break;
        case 'SALES_REP':
          navigate('/sales-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);

      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit1 = (event) => {
  //   event.preventDefault();

  //   if (username === 'admin' && password === 'admin') {
  //     navigate('/admin-dashboard');
  //   } else if (username === 'sales' && password === 'sales') {
  //     navigate('/sales-dashboard');
  //   } else if (username === 'employee' && password === 'employee') {
  //     navigate('/employee-dashboard');
  //   } else {
  //     authContext.setAuthenticated(false);
  //     alert('Invalid credentials');
  //   }
  // };

  return (
    <div
      className='relative flex items-center justify-center w-full h-screen overflow-hidden'
      style={{
        backgroundImage: `url('/loginbg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Note: 'fixed' may not work as expected in some contexts
        backgroundColor: 'black', // Fallback color
        position: 'fixed',
      }}
    >
      {/* Login Form Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h1 className='mb-5 text-2xl font-bold text-teal-900'>
          Welcome to PharmaPulse
        </h1>
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
              className='block mt-1 text-xs text-red-500 hover:underline'
            >
              Forgot Password?
            </NavLink>
          </div>

          {error && <div className='error-message'>{error}</div>}

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 bg-teal-700 text-white rounded-md hover:bg-[#003d33]'
          >
            {/* Login */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
