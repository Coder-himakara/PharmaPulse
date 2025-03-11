import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../../api/OrderApiService'; // adjust the path as needed
import apiClient from '../../../api/ApiClient'; // API client with baseURL configured

const OrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
  });
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: '', discount: '' },
  ]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch customers and products when the component mounts
  useEffect(() => {
    // Fetch all customers
    apiClient
      .get('/customers/all')
      .then((response) => {
        // Adjust extraction if your response is wrapped, e.g., response.data.data
        setCustomers(response.data.data || response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch customers:', error);
      });

    // Fetch all products
    apiClient
      .get('/products/all')
      .then((response) => {
        setProducts(response.data.data || response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  // Handle changes for the customer dropdown
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for each order item
  const handleOrderItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...orderItems];
    newItems[index][name] = value;
    setOrderItems(newItems);
  };

  // Function to fetch maximum available quantity for a product
  const handleShowMaxQuantity = (index) => {
    const productId = orderItems[index].productId;
    if (!productId) {
      alert('Please select a product first.');
      return;
    }
    apiClient
      .get(`/inventory/available-quantity/${productId}`)
      .then((response) => {
        const maxQty = response.data; // assuming the API returns a number
        const newItems = [...orderItems];
        newItems[index].maxQuantity = maxQty;
        setOrderItems(newItems);
      })
      .catch((error) => {
        console.error('Error fetching available quantity:', error);
        alert('Failed to fetch available quantity.');
      });
  };

  // Add a new empty order item
  const handleAddOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: '', quantity: '', discount: '' },
    ]);
  };

  // Remove an order item
  const handleRemoveOrderItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  // Submit order
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate customer selection
    if (!formData.customerId) {
      setErrorMessage('Please select a customer.');
      return;
    }

    // Validate each order item
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      if (!item.productId || !item.quantity) {
        setErrorMessage(
          'Each order item must have a selected product and a quantity.'
        );
        return;
      }
      if (isNaN(item.quantity) || Number(item.quantity) <= 0) {
        setErrorMessage('Quantity must be a positive number.');
        return;
      }
    }

    setErrorMessage('');

    // Construct order payload
    const orderData = {
      ...formData,
      orderItems: orderItems.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        discount: item.discount ? Number(item.discount) : 0,
      })),
    };

    // Call API to create the order
    createOrder(orderData)
      .then((response) => {
        console.log('Order created successfully:', response.data);
        setSuccessMessage('Order created successfully!');
        // Reset form fields
        setFormData({ customerId: '' });
        setOrderItems([{ productId: '', quantity: '', discount: '' }]);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => {
        console.error('Order creation failed:', error);
        setErrorMessage(
          error.response?.data?.message ||
            'Order creation failed. Please try again.'
        );
      });
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-4xl mx-auto p-5 bg-[#e6eef3] rounded-lg shadow-md border border-gray-300'
    >
      <h2 className='text-center bg-[#1a5353] text-white p-2 rounded-t-md -mx-5 mt-[-20px] mb-5 text-lg'>
        Create Order
      </h2>

      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4 text-center'>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className='text-[#3c5f3c] text-sm font-bold mb-4 text-center'>
          {successMessage}
        </p>
      )}

      {/* Customer Details */}
      <div className='mb-6'>
        <div className='flex items-center mb-4'>
          <label
            htmlFor='customerId'
            className='w-1/3 text-[16px] text-gray-800'
          >
            Customer:
          </label>
          <select
            id='customerId'
            name='customerId'
            value={formData.customerId}
            onChange={handleChange}
            className='w-2/3 px-2 py-2 border border-gray-300 rounded-md'
          >
            <option value=''>Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Items */}
      <div className='mb-6'>
        <h3 className='text-lg font-bold mb-4'>Order Items</h3>
        {orderItems.map((item, index) => (
          <div
            key={index}
            className='p-4 mb-4 border border-gray-300 rounded-md relative'
          >
            <div className='flex items-center mb-2'>
              <label
                htmlFor={`productId-${index}`}
                className='w-1/3 text-[16px] text-gray-800'
              >
                Product:
              </label>
              <select
                id={`productId-${index}`}
                name='productId'
                value={item.productId}
                onChange={(e) => handleOrderItemChange(index, e)}
                className='w-2/3 px-2 py-2 border border-gray-300 rounded-md'
              >
                <option value=''>Select a product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center mb-2'>
              <label
                htmlFor={`quantity-${index}`}
                className='w-1/3 text-[16px] text-gray-800'
              >
                Quantity:
              </label>
              <input
                type='number'
                id={`quantity-${index}`}
                name='quantity'
                value={item.quantity}
                onChange={(e) => handleOrderItemChange(index, e)}
                className='w-2/3 px-2 py-2 border border-gray-300 rounded-md'
              />
              <button
                type='button'
                onClick={() => handleShowMaxQuantity(index)}
                className='ml-2 px-2 py-1 bg-green-500 text-white rounded-md text-sm'
              >
                Show Max
              </button>
              {item.maxQuantity !== undefined && (
                <span className='ml-2 text-green-700'>
                  Max: {item.maxQuantity}
                </span>
              )}
            </div>
            <div className='flex items-center'>
              <label
                htmlFor={`discount-${index}`}
                className='w-1/3 text-[16px] text-gray-800'
              >
                Discount (%):
              </label>
              <input
                type='number'
                id={`discount-${index}`}
                name='discount'
                value={item.discount}
                onChange={(e) => handleOrderItemChange(index, e)}
                className='w-2/3 px-2 py-2 border border-gray-300 rounded-md'
              />
            </div>
            {orderItems.length > 1 && (
              <button
                type='button'
                onClick={() => handleRemoveOrderItem(index)}
                className='absolute top-2 right-2 text-sm text-red-600'
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type='button'
          onClick={handleAddOrderItem}
          className='px-4 py-2 bg-blue-500 text-white rounded-md text-sm'
        >
          Add Order Item
        </button>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-2'>
        <button
          type='submit'
          className='px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]'
        >
          Create Order
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className='px-5 py-2 bg-[#2a4d69] text-white rounded-md text-[16px] transition-all duration-300 hover:bg-[#00796b]'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
