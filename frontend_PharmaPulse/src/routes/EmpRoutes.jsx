/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddProductsForm from '../components/Forms/AddProductsForm';
import ProductsInfoTable from '../components/Tables/ProductsInfoTable';
import AddCustomersForm from '../components/Forms/AddCustomersForm';
import SuppliersInfoTable from '../components/Tables/SuppliersInfoTable';
import AddSuppliersForm from '../components/Forms/AddSuppliersForm';
import CustomersInfoTable from '../components/Tables/CustomersInfoTable';
import EditProductsForm from '../components/Forms/EditProductsForm';
import EditSuppliersForm from '../components/Forms/EditSuppliersForm';
import EditCustomersForm from '../components/Forms/EditCustomersForm';
import AddCustomerGroupForm from '../components/Forms/AddCustomerGroupForm';
import CustomerGroupInfoTable from '../components/Tables/CustomerGroupInfoTable';
import EditCustomerGroupForm from '../components/Forms/EditCustomerGroupForm';
import AddPurchaseGroupForm from '../components/Forms/AddPurchaseGroupForm';
import PurchaseGroupInfoTable from '../components/Tables/PurchaseGroupInfoTable';
import EditPurchaseGroupForm from '../components/Forms/EditPurchaseGroupForm';
import Sidebar from '../components/Sidebar/Sidebar';

const AppRoutes = () => {
  // Load from localStorage if available
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('products')) || []);
  const [suppliers, setSuppliers] = useState(() => JSON.parse(localStorage.getItem('suppliers')) || []);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('customers')) || []);
  const [customerGroups, setCustomerGroups] = useState(() => JSON.parse(localStorage.getItem('customerGroups')) || []);
  const [purchaseGroups, setPurchaseGroups] = useState(() => JSON.parse(localStorage.getItem('purchaseGroups')) || []);

  // Function to update localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('customerGroups', JSON.stringify(customerGroups));
  }, [customerGroups]);

  useEffect(() => {
    localStorage.setItem('purchaseGroups', JSON.stringify(purchaseGroups));
  }, [purchaseGroups]);

  // Functions to add new records and store in localStorage
  const addProduct = (product) => setProducts((prev) => [...prev, product]);
  const addSupplier = (supplier) => setSuppliers((prev) => [...prev, supplier]);
  const addCustomer = (customer) => setCustomers((prev) => [...prev, customer]);
  const addCustomerGroup = (customerGroup) => setCustomerGroups((prev) => [...prev, customerGroup]);
  const addPurchaseGroup = (purchaseGroup) => setPurchaseGroups((prev) => [...prev, purchaseGroup]);

  // Functions to update records and store in localStorage
  const updateProduct = (updated) => setProducts((prev) => prev.map((p) => (p.productId === updated.productId ? updated : p)));
  const updateSupplier = (updated) => setSuppliers((prev) => prev.map((s) => (s.supplierId === updated.supplierId ? updated : s)));
  const updateCustomer = (updated) => setCustomers((prev) => prev.map((c) => (c.customerId === updated.customerId ? updated : c)));
  const updateCustomerGroups = (updated) => setCustomerGroups((prev) => prev.map((cg) => (cg.customerGroupId === updated.customerGroupId ? updated : cg)));
  const updatePurchaseGroup = (updated) => setPurchaseGroups((prev) => prev.map((pg) => (pg.purchaseGroupId === updated.purchaseGroupId ? updated : pg)));

  return (
    <Routes>
      <Route path='/add-products' element={<AddProductsForm onAddProduct={addProduct} />} />
      <Route path='/products-info' element={<ProductsInfoTable products={products} />} />
      <Route path='/edit-product/:productId' element={<EditProductsForm onUpdateProduct={updateProduct} />} />

      <Route path='/add-suppliers' element={<AddSuppliersForm onAddSupplier={addSupplier} />} />
      <Route path='/suppliers-info' element={<SuppliersInfoTable suppliers={suppliers} />} />
      <Route path='/edit-supplier/:supplierId' element={<EditSuppliersForm onUpdateSupplier={updateSupplier} />} />

      <Route path='/add-customers' element={<AddCustomersForm onAddCustomer={addCustomer} />} />
      <Route path='/customers-info' element={<CustomersInfoTable customers={customers} />} />
      <Route path='/edit-customer/:customerId' element={<EditCustomersForm onUpdateCustomer={updateCustomer} />} />

      <Route path='/add-customer-group' element={<AddCustomerGroupForm onAddCustomerGroups={addCustomerGroup} />} />
      <Route path='/customer-group-info' element={<CustomerGroupInfoTable customerGroups={customerGroups} />} />
      <Route path='/edit-customer-group/:customerGroupId' element={<EditCustomerGroupForm onUpdateCustomerGroups={updateCustomerGroups} />} />

      <Route path='/add-purchase-group' element={<AddPurchaseGroupForm onAddPurchaseGroups={addPurchaseGroup} />} />
      <Route path='/purchase-group-info' element={<PurchaseGroupInfoTable purchaseGroups={purchaseGroups} />} />
      <Route path='/edit-purchase-group/:purchaseGroupId' element={<EditPurchaseGroupForm onUpdatePurchaseGroups={updatePurchaseGroup} />} />

      <Route path='/home' element={<Sidebar role='employee' />} />
      <Route path='/dashboard' element={<Sidebar role='employee' />} />
    </Routes>
  );
};

export default AppRoutes;
