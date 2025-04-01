/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeDashboardCard from '../pages/EmployeeDashboard/EmployeeDashboardCard';

import AddProductsForm from "../components/Forms/employeeForms/products/AddProductsForm";
import ProductsInfoTable from "../components/Tables/employeeTables/products/ProductsInfoTable";
import EditProductsForm from "../components/Forms/employeeForms/products/EditProductsForm";
import ViewProductDetails from "../components/Tables/employeeTables/products/ViewProductDetails";

import AddCustomersForm from "../components/Forms/employeeForms/Partners/customer/AddCustomersForm";
import CustomersInfoTable from "../components/Tables/employeeTables/partners/customer/CustomersInfoTable";
import EditCustomersForm from "../components/Forms/employeeForms/Partners/customer/EditCustomersForm";
import ViewCustomerDetails from "../components/Tables/employeeTables/partners/customer/ViewCustomerDetails";

import AddSuppliersForm from "../components/Forms/employeeForms/Partners/suppliers/AddSuppliersForm";
import SuppliersInfoTable from "../components/Tables/employeeTables/partners/supplier/SuppliersInfoTable";
import EditSuppliersForm from "../components/Forms/employeeForms/Partners/suppliers/EditSuppliersForm";
import ViewSupplierDetails from "../components/Tables/employeeTables/partners/supplier/ViewSupplierDetails";

import AddCustomerGroupForm from "../components/Forms/employeeForms/Partners/customerGroup/AddCustomerGroupForm";
import CustomerGroupInfoTable from "../components/Tables/employeeTables/partners/customerGroup/CustomerGroupInfoTable";
import EditCustomerGroupForm from "../components/Forms/employeeForms/Partners/customerGroup/EditCustomerGroupForm";
import ViewCustomerGroupDetails from "../components/Tables/employeeTables/partners/customerGroup/ViewCustomerGroupDetails";

import AddPurchaseGroupForm from "../components/Forms/employeeForms/Partners/purchaseGroup/AddPurchaseGroupForm";
import PurchaseGroupInfoTable from "../components/Tables/employeeTables/partners/purchaseGroup/PurchasegroupInfoTable";
import EditPurchaseGroupForm from "../components/Forms/employeeForms/Partners/purchaseGroup/EditPurchaseGroupForm";
import ViewPurchaseGroupDetails from "../components/Tables/employeeTables/partners/purchaseGroup/ViewPurchaseGroupDetails";

import AddPurchaseInvoiceForm from "../components/Forms/employeeForms/invoicing/purchase/AddPurchaseInvoiceForm";
import PurchaseInvoiceInfoTable from "../components/Tables/employeeTables/invoicing/purchase/PurchaseInvoiceInfoTable";
import EditPurchaseInvoiceForm from "../components/Forms/employeeForms/invoicing/purchase/EditPurchaseInvoiceForm";

import StockTransferForm from "../components/Forms/employeeForms/inventory/inventoryWise/StockTransferForm"; 

import ReceiptForm from "../components/Forms/employeeForms/payments/ReceiptForm"

import MonthlyReportForm from "../components/Forms/employeeForms/reports/MonthlyReportForm"

import StockBalanceReportForm from "../components/Forms/employeeForms/reports/StockBalanceReportForm"

const EmpRoutes = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

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

  const addPurchaseInvoice = (purchaseInvoice) => {
    setPurchaseInvoices((prevPurchaseInvoices) => [
      ...prevPurchaseInvoices,
      purchaseInvoice,
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

  const updatePurchaseInvoice = (updatedPurchaseInvoice) => {
    setPurchaseInvoices((prevPurchaseInvoices) =>
      prevPurchaseInvoices.map((purchaseInvoice) =>
        purchaseInvoice.purchaseInvoiceId ===
        updatedPurchaseInvoice.purchaseInvoiceId
          ? updatedPurchaseInvoice
          : purchaseInvoice
      )
    );
  };

  return (
    <Routes>
      <Route
        path="add-products"
        element={<AddProductsForm onAddProduct={addProduct} />}
      />
      <Route
        path="products-info"
        element={<ProductsInfoTable products={products} />}
      />
      <Route
        path="edit-product/:productId"
        element={<EditProductsForm onUpdateProduct={updateProduct} />}
      />
      <Route path="view-product/:productId" element={<ViewProductDetails />} />

      <Route
        path="add-suppliers"
        element={<AddSuppliersForm onAddSupplier={addSupplier} />}
      />
      <Route
        path="suppliers-info"
        element={<SuppliersInfoTable suppliers={suppliers} />}
      />
      <Route
        path="edit-supplier/:supplierId"
        element={<EditSuppliersForm onUpdateSupplier={updateSupplier} />}
      />
      <Route
        path="view-supplier/:supplierId"
        element={<ViewSupplierDetails />}
      />

      <Route
        path="add-customers"
        element={<AddCustomersForm onAddCustomer={addCustomer} />}
      />
      <Route
        path="customers-info"
        element={<CustomersInfoTable customers={customers} />}
      />
      <Route
        path="edit-customer/:customerId"
        element={<EditCustomersForm onUpdateCustomer={updateCustomer} />}
      />
      <Route
        path="view-customer/:customerId"
        element={<ViewCustomerDetails />}
      />

      <Route
        path="add-customer-group"
        element={<AddCustomerGroupForm onAddCustomerGroup={addCustomerGroup} />}
      />
      <Route
        path="customer-group-info"
        element={<CustomerGroupInfoTable customerGroups={customerGroups} />}
      />
      <Route
        path="edit-customer-group/:customerGroupId"
        element={
          <EditCustomerGroupForm onUpdateCustomerGroup={updateCustomerGroup} />
        }
      />
      <Route
        path="view-customer-group/:customerGroupId"
        element={<ViewCustomerGroupDetails />}
      />

      <Route
        path="add-purchase-group"
        element={<AddPurchaseGroupForm onAddPurchaseGroup={addPurchaseGroup} />}
      />
      <Route
        path="purchase-group-info"
        element={<PurchaseGroupInfoTable purchaseGroups={purchaseGroups} />}
      />
      <Route
        path="edit-purchase-group/:purchaseGroupId"
        element={
          <EditPurchaseGroupForm onUpdatePurchaseGroup={updatePurchaseGroup} />
        }
      />
      <Route
        path="view-purchase-group/:purchaseGroupId"
        element={<ViewPurchaseGroupDetails />}
      />

      <Route
        path="add-purchase-invoice"
        element={
          <AddPurchaseInvoiceForm onAddPurchaseInvoice={addPurchaseInvoice} />
        }
      />
      <Route
        path="purchase-invoice-info"
        element={
          <PurchaseInvoiceInfoTable purchaseInvoices={purchaseInvoices} />
        }
      />
      <Route
        path="edit-purchase-invoice/:purchaseInvoiceId"
        element={
          <EditPurchaseInvoiceForm
            onUpdatePurchaseInvoice={updatePurchaseInvoice}
          />
        }
      />

 
      <Route
        path="stock-transfer"
        element={<StockTransferForm />}
      />

    <Route
        path="receipt-generate"
        element={<ReceiptForm />}
      />

    <Route
        path="monthly-report-generate"
        element={<MonthlyReportForm />}
      />
        <Route
        path="stock-balance-report-generate"
        element={<StockBalanceReportForm />}
      />
      <Route path="/"  element={<EmployeeDashboardCard />} />

      <Route  path="/employee-dashboard"/>

    </Routes>
  );
};

export default EmpRoutes;