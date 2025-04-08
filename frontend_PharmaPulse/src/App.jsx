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
import Footer from "./components/Footer/Footer";

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Content Wrapper with Bottom Padding */}
            <div className="flex-grow pb-20">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Routes */}
                <Route
                  path="/admin-dashboard/*"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee-dashboard/*"
                  element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales-dashboard/*"
                  element={
                    <ProtectedRoute allowedRoles={['SALES_REP']}>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            
            {/* Add Footer component here */}
            <Footer />
           
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss={true}
            draggable={true}
            pauseOnHover={true}
          />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;