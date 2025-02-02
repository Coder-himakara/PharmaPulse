/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AddProductsForm from "../components/Forms/AddProductsForm";
import ProductsInfoTable from "../components/Tables/ProductsInfoTable";
import AddCustomersForm from "../components/Forms/AddCustomersForm";
import SuppliersInfoTable from "../components/Tables/SuppliersInfoTable";
import AddSuppliersForm from "../components/Forms/AddSuppliersForm";
import CustomersInfoTable from "../components/Tables/CustomersInfoTable";
import EditProductsForm from "../components/Forms/EditProductsForm";
import EditSuppliersForm from "../components/Forms/EditSuppliersForm";
import EditCustomersForm from "../components/Forms/EditCustomersForm";
import AddCustomerGroupForm from "../components/Forms/AddCustomerGroupForm";
import CustomerGroupInfoTable from "../components/Tables/CustomerGroupInfoTable";
import EditCustomerGroupForm from "../components/Forms/EditCustomerGroupForm";
import AddPurchaseGroupForm from "../components/Forms/AddPurchaseGroupForm";
import PurchaseGroupInfoTable from "../components/Tables/PurchaseGroupInfoTable";
import EditPurchaseGroupForm from "../components/Forms/EditPurchaseGroupForm";

import Sidebar from "../components/Sidebar/Sidebar";

const EmpRoutes = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [purchaseGroups, setPurchaseGroups] = useState([]);

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const addSupplier = (supplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, supplier]);
  };

  const addCustomer = (customer) => {
    setCustomers((prevCustomers) => [...prevCustomers, customer]);
  };

  const addCustomerGroup = (customerGroup) => {
    setCustomerGroups((prevCustomerGroups) => [
      ...prevCustomerGroups,
      customerGroup,
    ]);
  };

  const addPurchaseGroup = (purchaseGroup) => {
    setPurchaseGroups((prevPurchaseGroups) => [
      ...prevPurchaseGroups,
      purchaseGroup,
    ]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === updatedProduct.productId
          ? updatedProduct
          : product
      )
    );
  };

  const updateSupplier = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.supplierId === updatedSupplier.supplierId
          ? updatedSupplier
          : supplier
      )
    );
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customerId === updatedCustomer.customerId
          ? updatedCustomer
          : customer
      )
    );
  };

  const updateCustomerGroup = (updatedCustomerGroup) => {
    setCustomerGroups((prevCustomerGroups) =>
      prevCustomerGroups.map((customerGroup) =>
        customerGroup.customerGroupId === updatedCustomerGroup.customerGroupId
          ? updatedCustomerGroup
          : customerGroup
      )
    );
  };

  const updatePurchaseGroup = (updatedPurchaseGroup) => {
    setPurchaseGroups((prevPurchaseGroups) =>
      prevPurchaseGroups.map((purchaseGroup) =>
        purchaseGroup.purchaseGroupId === updatedPurchaseGroup.purchaseGroupId
          ? updatedPurchaseGroup
          : purchaseGroup
      )
    );
  };

  return (
    <Routes>
      <Route
        path="/add-products"
        element={<AddProductsForm onAddProduct={addProduct} />}
      />
      <Route
        path="/products-info"
        element={<ProductsInfoTable products={products} />}
      />
      <Route
        path="/edit-product/:productId"
        element={<EditProductsForm onUpdateProduct={updateProduct} />}
      />

      <Route
        path="/add-suppliers"
        element={<AddSuppliersForm onAddSupplier={addSupplier} />}
      />
      <Route
        path="/suppliers-info"
        element={<SuppliersInfoTable suppliers={suppliers} />}
      />
      <Route
        path="/edit-supplier/:supplierId"
        element={<EditSuppliersForm onUpdateSupplier={updateSupplier} />}
      />

      <Route
        path="/add-customers"
        element={<AddCustomersForm onAddCustomer={addCustomer} />}
      />
      <Route
        path="/customers-info"
        element={<CustomersInfoTable customers={customers} />}
      />
      <Route
        path="/edit-customer/:customerId"
        element={<EditCustomersForm onUpdateCustomer={updateCustomer} />}
      />

      <Route
        path="/add-customer-group"
        element={<AddCustomerGroupForm onAddCustomerGroup={addCustomerGroup} />}
      />
      <Route
        path="/customer-group-info"
        element={<CustomerGroupInfoTable customerGroups={customerGroups} />}
      />
      <Route
        path="/edit-customer-group/:customerGroupId"
        element={
          <EditCustomerGroupForm onUpdateCustomerGroup={updateCustomerGroup} />
        }
      />

      <Route
        path="/add-purchase-group"
        element={<AddPurchaseGroupForm onAddPurchaseGroup={addPurchaseGroup} />}
      />
      <Route
        path="/purchase-group-info"
        element={<PurchaseGroupInfoTable purchaseGroups={purchaseGroups} />}
      />
      <Route
        path="/edit-purchase-group/:purchaseGroupId"
        element={
          <EditPurchaseGroupForm onUpdatePurchaseGroup={updatePurchaseGroup} />
        }
      />

      <Route path="/home" element={<Sidebar role="employee" />} />
      <Route path="/dashboard" element={<Sidebar role="employee" />} />
    </Routes>
  );
};

export default EmpRoutes;
