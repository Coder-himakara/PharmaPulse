/*import Navbar from '../../components/Navbar/Navbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import EmpRoutes from '../../routes/EmpRoutes';

const EmployeeDashboard = () => {
  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <Navbar />
      <div className='flex flex-grow'>
        <div className='flex flex-col flex-grow p-6'>
          <div className='flex-grow'>
            <DashboardCard
              content={<EmpRoutes />}
              className='p-4 bg-white rounded-lg shadow-md'
            />
          </div>
        </div>
      </div>
      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default EmployeeDashboard;
*/

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import EmpRoutes from '../../routes/EmpRoutes';

const EmployeeDashboard = () => {
  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <Navbar />
      <div className='flex flex-grow'>
        <Sidebar role='employee' className='w-1/5 bg-white shadow-lg' />
        <div className='flex flex-col flex-grow p-6'>
          <div className='flex-grow'>
            <DashboardCard
              content={<EmpRoutes />}
              className='p-4 bg-white rounded-lg shadow-md'
            />
          </div>
        </div>
      </div>
      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default EmployeeDashboard;
