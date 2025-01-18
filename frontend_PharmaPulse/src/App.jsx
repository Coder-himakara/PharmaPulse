/* eslint-disable prettier/prettier */
import { BrowserRouter as Router } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import './App.css';
import './index.css';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className='App'>
        <EmployeeDashboard />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
