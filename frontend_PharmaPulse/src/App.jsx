/* eslint-disable prettier/prettier */
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import "./App.css";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/employee-dashboard' element={<EmployeeDashboard />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
