import Footer from "./components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import DashboardCard from "./components/DashboardCard/DashboardCard";

import "./App.css";
//import "./Responsiveness/Responsive.css";

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Footer />
      <DashboardCard />
    </>
  );
}

export default App;
