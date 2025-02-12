/* eslint-disable prettier/prettier */
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CustomersInfoTable = ({ customers }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    navigate("/home");
  };

  const handleEdit = (customerId) => {
    const customer = customers.find((c) => c.customerId === customerId);
    navigate(`/edit-customer/${customerId}`, { state: { customer } });
  };

  const handleViewCustomer = (customer) => {
    navigate(`/view-customer/${customer.customerId}`, { state: { customer } });
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Customers Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Customers</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {filteredCustomers.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No customers found matching your search.
        </div>
      )}

      <div className="p-2 m-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Customer Name
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Customer ID
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Status
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Credit Limit
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Credit Period
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Email
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Phone Number
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Contact Name
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.customerName}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.customerId}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.status}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.creditLimit}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.email}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.phoneNo}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  {customer.contactName}
                </td>
                <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                  <button
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                    onClick={() => handleEdit(customer.customerId)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
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
    </div>
  );
};

CustomersInfoTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerName: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      creditLimit: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNo: PropTypes.string.isRequired,
      contactName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomersInfoTable;
