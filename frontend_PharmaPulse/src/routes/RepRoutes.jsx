//import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
//import Sidebar from '../components/Sidebar/Sidebar';
//import Sidebar from '../saleRepresentativeComponent/Sidebar/Sidebar';
import PriceListTable from '../components/Tables/saleRepTable/PriceListTable';
import OrderForm from '../components/Forms/saleRepForm/OrderForm';
import SalesRepSidebar from '../components/Sidebar/SalesRepSidebar';

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
      
            
      
      
     
     

      <Route path='/home' element={<SalesRepSidebar role='salerep' />} />
      <Route path='/dashboard' element={<SalesRepSidebar role='salerep' />} />
    </Routes>
  );
};

export default RepRoutes;
