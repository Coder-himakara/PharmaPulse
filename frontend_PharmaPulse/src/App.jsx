/* eslint-disable prettier/prettier */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/sales-dashboard/*" element={<SalesRepDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
