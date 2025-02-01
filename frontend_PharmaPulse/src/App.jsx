/* eslint-disable prettier/prettier */
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";

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
