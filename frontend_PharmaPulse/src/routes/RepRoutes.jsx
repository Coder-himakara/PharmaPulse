import { Routes, Route } from 'react-router-dom';
import PriceListTable from '../components/Tables/saleRepTable/PriceListTable';
import OrderForm from '../components/Forms/saleRepForms/OrderForm';
import OrderHistoryTable from '../components/Tables/saleRepTable/OrderHistory';
import SaleInvoiceCreateForm from '../components/Forms/saleRepForms/SaleInvoiceCreateForm ';

const RepRoutes = () => {
  return (
    <Routes>
      <Route path='price-list-view' element={<PriceListTable />} />
      <Route path='order-creation' element={<OrderForm />} />
      <Route path='order-history' element={<OrderHistoryTable />} />
      <Route path='sale-invoice-creation' element={<SaleInvoiceCreateForm />} />
    </Routes>
  );
};

export default RepRoutes;
