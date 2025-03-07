/* eslint-disable prettier/prettier */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AuthProvider from './security/AuthProvider';
// Components
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import UnauthorizedPage from "./pages/ErrorPage/UnauthorizedPage";
import ProtectedRoute from "./security/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route path="/admin-dashboard/*" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/employee-dashboard/*" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            <Route path="/sales-dashboard/*" element={
              <ProtectedRoute allowedRoles={['SALES_REP']}>
                <SalesRepDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;