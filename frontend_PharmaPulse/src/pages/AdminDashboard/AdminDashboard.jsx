import Navbar from '../../components/Navbar/AdminNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import AdminRoutes from '../../routes/AdminRoutes';

const AdminDashboard = () => {
  return (
    <div className='flex flex-col h-screen overflow-hidden bg-gray-100'>
      <Navbar />

      {/* Main Dashboard Section (Fixed, No Scroll) */}
      <div className='flex flex-grow overflow-hidden'>
        <div className='flex flex-col flex-grow p-6 overflow-hidden'>
          <div className='flex-grow overflow-hidden'>
            <DashboardCard
              content={<AdminRoutes />}
              className='p-4 bg-white rounded-lg shadow-md'
            />
          </div>
        </div>
      </div>

      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default AdminDashboard;
