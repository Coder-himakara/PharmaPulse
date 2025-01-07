//import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/SideBar';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Sidebar />
      </main>
      <Footer />
    </div>
  );
}

export default App;
