import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllCustomers } from '../../../../../api/EmployeeApiService';

const CustomersInfoTable = ({ refreshTrigger }) => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        console.log('Fetching customers with refreshTrigger:', refreshTrigger);

        // Check if there's updated customer data in location state
        if (location.state?.updatedCustomer) {
          console.log(
            'Found updated customer in location state:',
            location.state.updatedCustomer,
          );
        }

        const response = await getAllCustomers();
        console.log('Response Data:', response.data);
        const customerData = response.data.data || response.data || [];
        setCustomers(customerData);
        console.log('Set Customers:', customerData);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching customers:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const errorMsg =
          error.response?.data?.message ||
          'Failed to fetch customers. Please try again.';
        setErrorMessage(errorMsg);

        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshTrigger, navigate, location]);

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClose = () => {
    navigate('/employee-dashboard');
  };

  const handleEdit = (customerId) => {
    const customer = customers.find((c) => c.customer_id === customerId);
    if (customer) {
      navigate(`/employee-dashboard/edit-customer/${customerId}`, {
        state: { customer },
      });
    } else {
      setErrorMessage('Customer not found for editing.');
    }
  };

  const handleViewCustomer = (customer) => {
    if (customer) {
      navigate(`/employee-dashboard/view-customer/${customer.customer_id}`, {
        state: { customer },
      });
    } else {
      setErrorMessage('Customer not found for viewing.');
    }
  };

  if (loading) {
    return (
      <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative flex items-center justify-center p-10'>
        <div className='w-16 h-16 border-4 border-[#1a5353] border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='p-1 m-1 text-2xl'>Customers Management</h1>
        <button
          onClick={handleClose}
          className='absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-2xl cursor-pointer hover:text-[#f1f1f1]'
        >
          X
        </button>
      </div>
      {errorMessage && (
        <p className='text-[#991919] text-sm font-bold mb-4 text-center'>
          {errorMessage}
        </p>
      )}
      <div className='flex items-center justify-between p-2 m-2'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Customers</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search Customers...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
          />
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          {search
            ? 'No customers found matching your search.'
            : 'No customers available.'}
        </div>
      )}

      {filteredCustomers.length > 0 && (
        <div className='p-2 m-2'>
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Customer Name
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Contact Name
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Phone Number
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Email
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Credit Limit (Rs.)
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Outstanding Balance (Rs.)
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Credit Period (Days)
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {customer.customer_name}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {customer.customer_contact_name}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {customer.customer_phone_no}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {customer.customer_email}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {parseFloat(customer.credit_limit).toFixed(2)}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {parseFloat(customer.outstanding_balance).toFixed(2)}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {customer.credit_period_in_days}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    <button
                      className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                      onClick={() => handleEdit(customer.customer_id)}
                    >
                      Edit
                    </button>
                    <button
                      className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                      onClick={() => handleViewCustomer(customer)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

CustomersInfoTable.propTypes = {
  refreshTrigger: PropTypes.number,
};

CustomersInfoTable.defaultProps = {
  refreshTrigger: 0,
};

export default CustomersInfoTable;
