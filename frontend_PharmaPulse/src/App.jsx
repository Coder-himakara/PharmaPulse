/* eslint-disable prettier/prettier */
import { BrowserRouter as Router } from "react-router-dom";
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import "./App.css";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";


function App() {
  return (
    <ThemeProvider>
      <Router>
        
        
        <SalesRepDashboard />
        
      </Router>
    </ThemeProvider>
  );
}

export default App;
