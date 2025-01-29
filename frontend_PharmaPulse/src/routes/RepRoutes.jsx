import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';


import AddProductsForm from '../components/Forms/AddProductsForm';
import ProductsInfoTable from '../components/Tables/ProductsInfoTable';
import OrderForm from '../saleRepresentativeComponent/Forms/OrderForm';

import Sidebar from '../components/Sidebar/Sidebar';

const RepRoutes = () => {
  const [products, setProducts] = useState([]);
 

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  

  

  return (
    <Routes>
      <Route
              path='/add-products'
              element={<OrderForm onAddProduct={addProduct} />}
            />
            
      
      
     
     

      <Route path='/home' element={<Sidebar role='employee' />} />
      <Route path='/dashboard' element={<Sidebar role='employee' />} />
    </Routes>
  );
};

export default RepRoutes;
