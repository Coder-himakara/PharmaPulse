/* eslint-disable prettier/prettier */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

// Directly importing components
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />

          {/* Employee Dashboard */}
          <Route path="/employee-dashboard/*" element={<EmployeeDashboard />} />

          {/* Sales Rep Dashboard */}
          <Route path="/sales-dashboard/*" element={<SalesRepDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
