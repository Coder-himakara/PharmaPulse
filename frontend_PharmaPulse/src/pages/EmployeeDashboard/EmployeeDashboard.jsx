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
import EditProductsForm from '../../components/Forms/EditProductsForm';

const EmployeeDashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  const handleSelect = (section) => {
    setSelectedSection(section);
    setActiveLink(section);
  };

  const handleCancelEditProduct = () => {
    setSelectedSection('productsInfo'); // Navigate to ProductsInfoTable
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

  const updateProduct = (updatedProduct) => {
    // Directly update the product in the list
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === updatedProduct.productId
          ? updatedProduct
          : product,
      ),
    );
    setSelectedSection('productsInfo');
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product); // Set the product to edit
    setSelectedSection('editProduct'); // Set the section to editProduct to show EditProductsForm
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
      <AddSuppliersForm onClose={handleCloseForm} onAddSupplier={() => {}} />
    ),
    suppliersInfo: <SuppliersInfoTable suppliers={[]} />,
    addCustomer: (
      <AddCustomersForm onClose={handleCloseForm} onAddCustomer={() => {}} />
    ),
    customersInfo: <CustomersInfoTable customers={[]} />,
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
