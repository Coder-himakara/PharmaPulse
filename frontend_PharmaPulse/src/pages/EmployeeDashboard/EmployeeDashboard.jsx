import Navbar from '../../components/Navbar/EmployeeNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import EmpRoutes from '../../routes/EmpRoutes';

const EmployeeDashboard = () => {
  return (
    <div>
      <Navbar />

      <DashboardCard
        content={<EmpRoutes />}
        
      />
    
    </div>
  );
};

export default EmployeeDashboard;
