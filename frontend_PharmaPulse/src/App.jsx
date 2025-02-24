/* eslint-disable prettier/prettier */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import Footer from "./components/Footer/Footer";
import { Suspense, lazy } from "react";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard/EmployeeDashboard"));
const SalesRepDashboard = lazy(() => import("./pages/SalesRepDashboard/SalesRepDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/admin-dashboard/*"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/employee-dashboard/*"
              element={
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              }
            />
            <Route
              path="/sales-dashboard/*"
              element={
                <Layout>
                  <SalesRepDashboard />
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
