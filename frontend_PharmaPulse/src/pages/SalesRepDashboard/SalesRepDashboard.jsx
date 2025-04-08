/* eslint-disable prettier/prettier */
/*import SalesRepNavbar from '../../components/Navbar/SalesRepNavbar';

import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';

import RepRoutes from '../../routes/RepRoutes';
import SalesRepSidebar from '../../components/Sidebar/SalesRepSidebar';
const SalesRepDashboard = () => {
  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <SalesRepNavbar />
      <div className='flex flex-grow'>
        <SalesRepSidebar role='salerep' className='w-1/5 bg-white shadow-lg' />
        <div className='flex flex-col flex-grow p-6'>
          <div className='flex-grow'>
            <DashboardCard
              content={<RepRoutes />}
              className='p-4 bg-white rounded-lg shadow-md'
            />
          </div>
        </div>
      </div>
      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default SalesRepDashboard;*/

import Navbar from '../../components/Navbar/SalesRepNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import RepRoutes from '../../routes/RepRoutes';

const SalesRepDashboard = () => {
  return (
    <div >
      <Navbar />
          <DashboardCard
            content={<RepRoutes />}
          />

    </div>
  );
};

export default SalesRepDashboard;
