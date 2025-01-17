/*import { useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import Footer from "../../components/Footer/Footer";

import AddProductsForm from "../../components/Forms/AddProductsForm";
import AddSuppliersForm from "../../components/Forms/AddSuppliersForm";
import AddCustomersForm from "../../components/Forms/AddCustomersForm";
import ProductsInfoTable from "../../components/Tables/ProductsInfoTable";
import SuppliersInfoTable from "../../components/Tables/SuppliersInfoTable";
import CustomersInfoTable from "../../components/Tables/CustomersInfoTable";
import EditProductsForm from "../../components/Forms/EditProductsForm";
import EditSuppliersForm from "../../components/Forms/EditSuppliersForm";
import EditCustomersForm from "../../components/Forms/EditCustomersForm";

const EmployeeDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const handleSelect = (section) => {
    setSelectedSection(section);
    setActiveLink(section);
  };

  const handleCancelEditProduct = () => {
    setSelectedSection("productsInfo");
    setActiveLink(null);
    setProductToEdit(null);
  };

  const handleCancelEditSupplier = () => {
    setSelectedSection("suppliersInfo");
    setActiveLink(null);
    setProductToEdit(null);
  };

  const handleCancelEditCustomer = () => {
    setSelectedSection("customersInfo");
    setActiveLink(null);
    setProductToEdit(null);
  };

  const handleCloseForm = () => {
    setSelectedSection(null);
    setActiveLink(null);
    setProductToEdit(null);
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

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === updatedProduct.productId
          ? updatedProduct
          : product
      )
    );
    setSelectedSection("productsInfo");
  };

  const updateSupplier = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.supplierId === updatedSupplier.supplierId
          ? updatedSupplier
          : supplier
      )
    );
    setSelectedSection("suppliersInfo");
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customerId === updatedCustomer.customerId
          ? updatedCustomer
          : customer
      )
    );
    setSelectedSection("customersInfo");
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setSelectedSection("editProduct");
  };

  const handleEditSupplier = (supplier) => {
    setSupplierToEdit(supplier);
    setSelectedSection("editSupplier");
  };

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setSelectedSection("editCustomer");
  };

  const sectionComponents = {
    addProduct: (
      <AddProductsForm onClose={handleCloseForm} onAddProduct={addProduct} />
    ),
    productsInfo: (
      <ProductsInfoTable
        products={products}
        onEdit={handleEditProduct} // Pass handleEditProduct as the onEdit prop
      />
    ),
    editProduct: (
      <EditProductsForm
        product={productToEdit}
        onClose={handleCancelEditProduct}
        onUpdateProduct={updateProduct}
      />
    ),

    addSupplier: (
      <AddSuppliersForm onClose={handleCloseForm} onAddSupplier={addSupplier} />
    ),

    suppliersInfo: (
      <SuppliersInfoTable suppliers={suppliers} onEdit={handleEditSupplier} />
    ),

    editSupplier: (
      <EditSuppliersForm
        supplier={supplierToEdit}
        onClose={handleCancelEditSupplier}
        onUpdateSupplier={updateSupplier}
      />
    ),

    addCustomer: (
      <AddCustomersForm onClose={handleCloseForm} onAddCustomer={addCustomer} />
    ),

    customersInfo: (
      <CustomersInfoTable customers={customers} onEdit={handleEditCustomer} />
    ),

    editCustomer: (
      <EditCustomersForm
        customer={customerToEdit}
        onClose={handleCancelEditCustomer}
        onUpdateCustomer={updateCustomer}
      />
    ),
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <Sidebar onSelect={handleSelect} activeLink={activeLink} />
      <div className="dashboard-content">
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

*/
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import AppRoutes from '../../routes/AppRoutes';

const EmployeeDashboard = () => {
  return (
    <div className='employee-dashboard'>
      <Router>
        <Navbar />
        <Sidebar />
        <div className='dashboard-content'>
          <DashboardCard content={<AppRoutes />} />
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default EmployeeDashboard;
