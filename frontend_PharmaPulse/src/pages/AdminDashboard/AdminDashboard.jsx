import Navbar from '../../components/Navbar/Navbar';

import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import AdminRotes from '../../routes/AdminRoutes';


const AdminDashboard = () => {
  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <Navbar />
      <div className='flex flex-grow'>
        <AdminSidebar role='admin' className='w-1/5 bg-white shadow-lg' />
        <div className='flex flex-col flex-grow p-6'>
          <div className='flex-grow'>
            <DashboardCard
              content={<AdminRotes />}
              className='p-4 bg-white rounded-lg shadow-md'
            />
          </div>
        </div>
      </div>
      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default AdminDashboard ;
