import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CustomersInfoTable = ({ customers }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const dummyCustomers = [
    {
      customerId: '1',
      customerName: 'Lanka Distributors',
      status: 'Active',
      creditLimit: 'LKR 1,000,000',
      creditPeriod: '30 days',
      email: 'lanka.distributors@example.lk',
      phoneNo: '+94 11 2345678',
      contactName: 'Nalin Perera',
    },
    {
      customerId: '2',
      customerName: 'Ceylon Traders',
      status: 'Inactive',
      creditLimit: 'LKR 500,000',
      creditPeriod: '15 days',
      email: 'ceylon.traders@example.lk',
      phoneNo: '+94 77 9876543',
      contactName: 'Kasun Silva',
    },
    {
      customerId: '3',
      customerName: 'Sri Lanka Tea Exporters',
      status: 'Active',
      creditLimit: 'LKR 2,500,000',
      creditPeriod: '45 days',
      email: 'tea.exporters@example.lk',
      phoneNo: '+94 11 5551234',
      contactName: 'Dilani Fernando',
    },
    {
      customerId: '4',
      customerName: 'Colombo Electronics',
      status: 'Active',
      creditLimit: 'LKR 750,000',
      creditPeriod: '30 days',
      email: 'colombo.electronics@example.lk',
      phoneNo: '+94 71 2345678',
      contactName: 'Roshan Wijesekera',
    },
    {
      customerId: '5',
      customerName: 'Sri Lankan Fashion Hub',
      status: 'Active',
      creditLimit: 'LKR 1,200,000',
      creditPeriod: '30 days',
      email: 'fashionhub@example.lk',
      phoneNo: '+94 77 8765432',
      contactName: 'Shirani Perera',
    },
  ];

  const filteredCustomers = dummyCustomers.filter((customer) =>
    customer.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClose = () => {
    navigate('/employee-dashboard');
  };

  const handleEdit = (customerId) => {
    const customer = customers.find((c) => c.customerId === customerId);
    navigate(`/edit-customer/${customerId}`, {
      state: { customer },
    });
  };

  const handleViewCustomer = (customer) => {
    navigate(`/view-customer/${customer.customerId}`, {
      state: { customer },
    });
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='p-1 m-1 text-2xl'>Customers Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4'
          onClick={handleClose}
        >
          X
        </button>
      </div>

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

      {filteredCustomers.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No customers found matching your search.
        </div>
      )}

      <div className='p-2 m-2'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Customer Name
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Status
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Credit Limit (Rs.)
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Credit Period (Months)
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Email
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Phone Number
              </th>
              <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                Contact Name
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
                  {customer.customerName}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.status}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.creditLimit}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.creditPeriod}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.email}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.phoneNo}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  {customer.contactName}
                </td>
                <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                  <button
                    className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                    onClick={() => handleEdit(customer.customerId)}
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

            {/* Dummy Row */}
            <tr className='bg-[#f9f9f9] text-black italic'>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                K.Raja
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Active
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                5,000
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                5
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                raja12@gmail.com
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                0342222432
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Raja
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleEdit('dummy')}
                >
                  Edit
                </button>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleViewCustomer({ productId: 'dummy' })}
                >
                  View
                </button>
              </td>
            </tr>

            {/* Dummy Row */}
            <tr className='bg-[#f9f9f9] text-black italic'>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                R.M.Amila Silva
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Inactive
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                10,000
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                7
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                amilasilva234@gmail.com
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                0777767546
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Amila
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleEdit('dummy')}
                >
                  Edit
                </button>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleViewCustomer({ productId: 'dummy' })}
                >
                  View
                </button>
              </td>
            </tr>

            {/* Dummy Row */}
            <tr className='bg-[#f9f9f9] text-black italic'>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                P.M.K.Naveen Perera
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Suspended
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                7,000
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                3
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                pmknaveenperera11@gmail.com
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                0401234568
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                Naveen
              </td>
              <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleEdit('dummy')}
                >
                  Edit
                </button>
                <button
                  className='bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2'
                  onClick={() => handleViewCustomer({ productId: 'dummy' })}
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

CustomersInfoTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      creditLimit: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNo: PropTypes.string.isRequired,
      contactName: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomersInfoTable;
