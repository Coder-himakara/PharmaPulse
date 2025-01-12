import { useState } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';

import AddProductsForm from '../../components/Forms/AddProductsForm';
import AddSuppliersForm from '../../components/Forms/AddSuppliersForm';
import AddCustomersForm from '../../components/Forms/AddCustomersForm';
import ProductsInfoTable from '../../components/Tables/ProductsInfoTable';
import SuppliersInfoTable from '../../components/Tables/SuppliersInfoTable';
import CustomersInfoTable from '../../components/Tables/CustomersInfoTable';

const EmployeeDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleSelect = (section) => {
    setSelectedSection(section);
    setActiveLink(section);
  };

  const handleCloseForm = () => {
    setSelectedSection(null);
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
