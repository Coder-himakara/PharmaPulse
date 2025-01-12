import { useState } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';

import AddProductsForm from '../../components/Forms/Products/AddProductsForm';
import AddSuppliersForm from '../../components/Forms/Suppliers/AddSuppliersForm';
import AddCustomersForm from '../../components/Forms/Customers/AddCustomersForm';
import ProductsInfoTable from '../../components/Tables/Products/ProductsInfoTable';
import SuppliersInfoTable from '../../components/Tables/Suppliers/SuppliersInfoTable';
import CustomersInfoTable from '../../components/Tables/Customers/CustomersInfoTable';

const EmployeeDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeLink, setActiveLink] = useState(null); // Track active link
  const [products, setProducts] = useState([]); // State to hold the products
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleSelect = (section) => {
    setSelectedSection(section);
    setActiveLink(section);
  };

  const handleCloseForm = () => {
    setSelectedSection(null); // Clear the selected section to hide the form
    setActiveLink(null);
  };

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const addSupplier = (supplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, supplier]);
  };

  const addCustomer = (customer) => {
    setCustomers((prevCustomers) => [...prevCustomers, customer]);
  };

  // Section mapping for dynamic rendering
  const sectionComponents = {
    addProduct: (
      <AddProductsForm onClose={handleCloseForm} onAddProduct={addProduct} />
    ),
    productsInfo: <ProductsInfoTable products={products} />,
    addSupplier: (
      <AddSuppliersForm onClose={handleCloseForm} onAddSupplier={addSupplier} />
    ),
    suppliersInfo: <SuppliersInfoTable suppliers={suppliers} />,
    addCustomer: (
      <AddCustomersForm onClose={handleCloseForm} onAddCustomer={addCustomer} />
    ),
    customersInfo: <CustomersInfoTable customers={customers} />,
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
