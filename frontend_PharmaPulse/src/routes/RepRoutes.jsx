import { Routes, Route } from 'react-router-dom';
import PriceListTable from '../components/Tables/saleRepTable/PriceListTable';
import OrderForm from '../components/Forms/saleRepForms/OrderForm';

const RepRoutes = () => {
  return (
    <Routes>
      <Route path='price-list-view' element={<PriceListTable />} />
      <Route path='order-creation' element={<OrderForm />} />
    </Routes>
  );
};

export default RepRoutes;
