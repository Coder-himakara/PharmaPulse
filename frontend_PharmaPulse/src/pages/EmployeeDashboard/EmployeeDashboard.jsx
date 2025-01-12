import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import AddProductsForm from '../../components/Forms/Products/AddProductsForm';
import AddSuppliersForm from '../../components/Forms/Suppliers/AddSuppliersForm';
import AddCustomersForm from '../../components/Forms/Customers/AddCustomersForm';
import ProductsInfoTable from '../../components/Tables/Products/ProductsInfoTable';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const EmployeeDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeLink, setActiveLink] = useState(null); // Track active link

  const handleSelect = (section) => {
    setSelectedSection(section);
    setActiveLink(section);
  };

  const handleCloseForm = () => {
    setSelectedSection(null); // Clear the selected section to hide the form
    setActiveLink(null);
  };

  // Section mapping for dynamic rendering
  const sectionComponents = {
    addProduct: <AddProductsForm onClose={handleCloseForm} />,
    productsInfo: <ProductsInfoTable />,
    addSupplier: <AddSuppliersForm onClose={handleCloseForm} />,
    suppliersInfo: <h2>Suppliers Info (Under Construction)</h2>,
    addCustomer: <AddCustomersForm onClose={handleCloseForm} />,
    customersInfo: <h2>Customers Info (Under Construction)</h2>,
  };

  return (
    <div className='dashboard-container'>
      <Navbar />
      <Sidebar onSelect={handleSelect} activeLink={activeLink} />
      <div className='dashboard-content'>
        <DashboardCard
          content={
            sectionComponents[selectedSection] || (
              <h1>Welcome to the Dashboard!</h1>
            )
          }
        />
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
