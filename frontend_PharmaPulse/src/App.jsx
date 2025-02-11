/* eslint-disable prettier/prettier */

import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./ThemeContext";

//import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
//import SalesRepDashboard from "./pages/SalesRepDashboard/SalesRepDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/*<AdminDashboard />*/}

        <EmployeeDashboard />
        {/*<SalesRepDashboard />*/}
      </Router>
    </ThemeProvider>
  );
}

export default App;
