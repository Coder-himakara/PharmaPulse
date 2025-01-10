import Footer from "./components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import DashboardCard from "./components/DashboardCard/DashboardCard";

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
