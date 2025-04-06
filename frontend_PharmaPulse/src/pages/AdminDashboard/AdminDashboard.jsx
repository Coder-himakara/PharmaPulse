import Navbar from '../../components/Navbar/AdminNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import AdminRoutes from '../../routes/AdminRoutes';

const AdminDashboard = () => {
  return (
    <div >
      <Navbar />

      <DashboardCard
        content={<AdminRoutes />}
      />
  
    </div>
  );
};

export default AdminDashboard;
