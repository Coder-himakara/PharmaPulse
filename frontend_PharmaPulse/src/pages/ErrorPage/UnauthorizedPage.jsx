import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className='unauthorized-container'>
      <h1>403 - Access Denied</h1>
      <p>You don&apos;t have permission to view this page</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate('/')}>Return to Login</button>
    </div>
  );
};

export default UnauthorizedPage;
