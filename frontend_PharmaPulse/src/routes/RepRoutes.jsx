//import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';




import OrderForm from '../saleRepresentativeComponent/Forms/OrderForm';

//import Sidebar from '../components/Sidebar/Sidebar';
import Sidebar from '../saleRepresentativeComponent/Sidebar/Sidebar';
import PriceListTable from '../saleRepresentativeComponent/Tables/PriceListTable';

const RepRoutes = () => {
  

  

  

  

  return (
    <Routes>
      <Route
        path='/price-list-view'
        element={<  PriceListTable/>}
      />
      <Route
        path='/order-creation'
        element={< OrderForm />}
      />
      
            
      
      
     
     

      <Route path='/home' element={<Sidebar role='employee' />} />
      <Route path='/dashboard' element={<Sidebar role='employee' />} />
    </Routes>
  );
};

export default RepRoutes;
