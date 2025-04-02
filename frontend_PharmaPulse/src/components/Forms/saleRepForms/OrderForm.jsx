import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { createOrder } from '../../../api/OrderApiService'; // adjust the path as needed
import apiClient from '../../../api/ApiClient'; // API client with baseURL configured

const OrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: '',
  });
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: '', discount: '', maxQuantity: undefined },
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

  // Handle changes for the customer dropdown (react-select)
  const handleCustomerChange = (option) => {
    setFormData((prevData) => ({
      ...prevData,
      customerId: option.value,
    }));
  };

  // Handle changes for each order item; we mimic an event to keep existing logic
  const handleOrderItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...orderItems];
    newItems[index][name] = value;
    setOrderItems(newItems);
  };

  // Handle product selection using react-select in each order item
  const handleProductChange = (index, option) => {
    // Mimic an event so our handler works as before
    handleOrderItemChange(index, {
      target: { name: 'productId', value: option.value },
    });
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
      { productId: '', quantity: '', discount: '', maxQuantity: undefined },
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
          'Each order item must have a selected product and a quantity.',
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
        setOrderItems([
          { productId: '', quantity: '', discount: '', maxQuantity: undefined },
        ]);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => {
        console.error('Order creation failed:', error);
        setErrorMessage(
          error.response?.data?.message ||
            'Order creation failed. Please try again.',
        );
      });
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  // Options for react-select for customers
  const customerOptions = customers.map((customer) => ({
    value: customer.customer_id,
    label: customer.customer_name,
  }));

  // Options for react-select for products
  const productOptions = products.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));

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
          <div className='w-2/3'>
            <Select
              id='customerId'
              name='customerId'
              options={customerOptions}
              placeholder='Select a customer'
              onChange={handleCustomerChange}
              value={
                formData.customerId
                  ? customerOptions.find(
                      (option) => option.value === Number(formData.customerId),
                    )
                  : null
              }
            />
          </div>
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
              <div className='w-2/3'>
                <Select
                  id={`productId-${index}`}
                  name='productId'
                  options={productOptions}
                  placeholder='Select a product'
                  onChange={(option) => handleProductChange(index, option)}
                  value={
                    orderItems[index].productId
                      ? productOptions.find(
                          (option) =>
                            option.value ===
                            Number(orderItems[index].productId),
                        )
                      : null
                  }
                />
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <label
                htmlFor={`quantity-${index}`}
                className='w-1/3 text-[16px] text-gray-800'
              >
                Quantity:
              </label>
              <div className='w-2/3 flex items-center space-x-2'>
                <input
                  type='number'
                  id={`quantity-${index}`}
                  name='quantity'
                  value={item.quantity}
                  onChange={(e) => handleOrderItemChange(index, e)}
                  className='flex-1 px-2 py-2 border border-gray-300 rounded-md'
                />
                <button
                  type='button'
                  onClick={() => handleShowMaxQuantity(index)}
                  className='px-2 py-2 bg-green-500 text-white rounded-md text-sm'
                >
                  Show Max
                </button>
                {item.maxQuantity !== undefined && (
                  <span className='text-green-700'>
                    Max: {item.maxQuantity}
                  </span>
                )}
              </div>
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
