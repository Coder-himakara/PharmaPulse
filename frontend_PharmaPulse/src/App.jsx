/* eslint-disable prettier/prettier */

import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import "primeflex/primeflex.css"; // PrimeFlex (Optional)

//import Sidebar from "./components/Sidebar/Sidebar";

//import LoginPage from "./pages/LoginPage/LoginPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
//import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
//import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AdminDashboard />
        {/*<LoginPage />*/}
        {/*<EmployeeDashboard />*/}
        {/*<SalesRepDashboard />*/}
      </Router>
    </ThemeProvider>
  );
}

export default App;
