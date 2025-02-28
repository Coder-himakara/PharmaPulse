import Navbar from '../../components/Navbar/EmployeeNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import EmpRoutes from '../../routes/EmpRoutes';

const EmployeeDashboard = () => {
  return (
    <div className='bg-gray-100 '>
      <Navbar />

      <DashboardCard
        content={<EmpRoutes />}
        className='p-4 bg-white rounded-lg '
      />
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
