/* eslint-disable prettier/prettier */
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";


import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        
        
      <AdminDashboard />
      
        
        
       
       
      
        
      </Router>
    </ThemeProvider>
  )
  ;
}

export default App;
