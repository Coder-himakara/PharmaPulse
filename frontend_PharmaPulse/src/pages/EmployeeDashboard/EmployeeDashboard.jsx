import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import Footer from "../../components/Footer/Footer";
import AppRoutes from "../../routes/AppRoutes";

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <Router>
        <Navbar />
        <Sidebar />
        <div className="dashboard-content">
          <DashboardCard content={<AppRoutes />} />
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default EmployeeDashboard;
