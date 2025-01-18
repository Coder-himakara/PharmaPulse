import { BrowserRouter as Router } from "react-router-dom";
import EmployeeDashboard from "./pages/EmployeeDashboard/EmployeeDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <EmployeeDashboard />
      </div>
    </Router>
  );
}

export default App;
