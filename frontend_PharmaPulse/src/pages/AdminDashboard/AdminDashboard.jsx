import Navbar from '../../components/Navbar/AdminNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import AdminRoutes from '../../routes/AdminRoutes';

const AdminDashboard = () => {
  return (
    <div className='bg-gray-100 '>
      <Navbar />

      <DashboardCard
        content={<AdminRoutes />}
        className='p-4 bg-white rounded-lg '
      />
      <Footer className='py-4 text-center bg-gray-200' />
    </div>
  );
};

export default AdminDashboard;
