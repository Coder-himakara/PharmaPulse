/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/ApiClient";

// Date formatting helper function
const formatOrderDate = (orderDate) => {
  // Handle array format from backend (LocalDateTime serialization)
  if (Array.isArray(orderDate)) {
    const [year, month, day, hours, minutes] = orderDate;
    // JavaScript months are 0-indexed (January = 0)
    return new Date(year, month - 1, day, hours, minutes).toLocaleString();
  }
  
  // Handle ISO string format if backend changes serialization
  return new Date(orderDate).toLocaleString();
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (orderNumber) => {
    if (expandedRows.includes(orderNumber)) {
      setExpandedRows(expandedRows.filter((num) => num !== orderNumber));
    } else {
      setExpandedRows([...expandedRows, orderNumber]);
    }
  };

  const handleRemoveOrder = async (order) => {
    const confirmMessage = `Are you sure you want to remove order with ID: ${order.orderId}?`;
    if (window.confirm(confirmMessage)) {
      try {
        // Assuming the API endpoint is /orders/{id} as per backend mapping
        await apiClient.delete(`/orders/${order.orderId}`);
        // Remove the deleted order from the state
        setOrders(orders.filter((o) => o.orderId !== order.orderId));
      } catch (err) {
        console.error("Error removing order:", err);
        setError("Failed to remove order. Please try again later.");
      }
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Order History</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Orders</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {filteredOrders.length === 0 && search && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          No orders found matching your search.
        </div>
      )}

      <div className="p-2 m-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Order ID
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Order Number
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Customer Name
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Order Date
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Total Amount(Rs)
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Status
              </th>
              <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.orderNumber}>
                <tr
                  className="bg-[#c6dceb] hover:bg-[#dce4e9] cursor-pointer"
                  onClick={() => handleRowClick(order.orderNumber)}
                >
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {order.orderId}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {order.customerName}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {formatOrderDate(order.orderDate)}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {parseFloat(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {order.status}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row expand
                        handleRemoveOrder(order);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
                {expandedRows.includes(order.orderNumber) && (
                  <tr>
                    <td colSpan="7" className="p-4 bg-[#f1f1f1]">
                      <h3 className="text-xl font-bold mb-2">Order Items</h3>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-[#ffb24d] text-[#5e5757] text-sm">
                              <th className="border border-gray-400 p-2">
                                Product Name
                              </th>
                              <th className="border border-gray-400 p-2">
                                Quantity
                              </th>
                              <th className="border border-gray-400 p-2">
                                Unit Price(Rs)
                              </th>
                              <th className="border border-gray-400 p-2">
                                Discount(Rs)
                              </th>
                              <th className="border border-gray-400 p-2">
                                Line Total(Rs)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderItems.map((item, idx) => (
                              <tr key={idx} className="bg-[#c6dceb] text-center text-sm">
                                <td className="border border-gray-400 p-2">
                                  {item.productName}
                                </td>
                                <td className="border border-gray-400 p-2">
                                  {item.quantity}
                                </td>
                                <td className="border border-gray-400 p-2">
                                  {parseFloat(item.unitPrice).toFixed(2)}
                                </td>
                                <td className="border border-gray-400 p-2">
                                  {parseFloat(item.discount).toFixed(2)}
                                </td>
                                <td className="border border-gray-400 p-2">
                                  {parseFloat(item.lineTotal).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No order items found.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
