/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { useAuth } from '../../security/UseAuth';
import { webSocketConnections, disconnectWebSocket } from '../../api/WebSocketService';
import axios from 'axios';


const handleApiError = (error) => {
  if (error.response?.status === 401) {
    return {
      title: "Authentication Error",
      message: "Your session has expired. Please log in again.",
      technical: "Unauthorized access"
    };
  } else if (error.response) {
    return {
      title: `Error ${error.response.status}`,
      message: error.response.data.message || "An unexpected error occurred",
      technical: JSON.stringify(error.response.data)
    };
  } else if (error.request) {
    return {
      title: "Network Error",
      message: "Could not connect to the server. Please check your internet connection.",
      technical: "No response received from server"
    };
  } else {
    return {
      title: "Application Error",
      message: "An unexpected error occurred while processing your request.",
      technical: error.message || "Unknown error"
    };
  }
};

const EmployeeDashboardCard = ({ content, className }) => {


  const { token } = useAuth(); // Get token from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expiryTrend, setExpiryTrend] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalCustomers: 0,
    recentTransactions: 0
  });

  const [counts, setCounts] = useState({
    sixMonths: 0,
    threeMonths: 0,
    oneMonth: 0,
    oneWeek: 0,
    safeBatches: 0,
    // Quantities
    sixMonthsQuantity: 0,
    threeMonthsQuantity: 0,
    oneMonthQuantity: 0,
    oneWeekQuantity: 0,
    safeBatchesQuantity: 0
  });

  // State for stock availability
  const [stockSummary, setStockSummary] = useState({
    totalStock: 0,
    available: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [dashboardCounts, setDashboardCounts] = useState({
    productCount: 0,
    supplierCount: 0,
    customerCount: 0,
    expiredStockQuantity: 0,
    recentTransactions: 0
  });

  const [returnBatches, setReturnBatches] = useState({
    count: 0,
    totalValue: 0
  });

  // State for low stock items
  const [lowStockItems, setLowStockItems] = useState([]);

  // State for out of stock items - this was unused, now commented with a note
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  // NOTE: outOfStockItems is set but not currently displayed in the UI
  // Future enhancement: Add an "Out of Stock Items" section similar to "Low Stock Items"

  // Mock data for stock trend over time (would be replaced with real API data)
  // Using const instead of useState since we don't need to update this after initialization
  const stockTrend = [
    { month: 'Jan', available: 120, lowStock: 20, outOfStock: 5 },
    { month: 'Feb', available: 140, lowStock: 15, outOfStock: 3 },
    { month: 'Mar', available: 130, lowStock: 18, outOfStock: 4 },
    { month: 'Apr', available: 125, lowStock: 22, outOfStock: 6 },
    { month: 'May', available: 150, lowStock: 10, outOfStock: 2 },
    { month: 'Jun', available: 145, lowStock: 12, outOfStock: 3 }
  ];

  // Add this with other state declarations
  const [stockTrendData, setStockTrendData] = useState(stockTrend);

  // Function to transform API data into the required format with better handling of nested data
  const transformExpiryCounts = (data = {}) => {
    // Check if data is wrapped in a data property (common Spring Boot pattern)
    const countsData = data.data || data;

    return {
      // Use the first element of each array (Number_of_batches) or default to 0
      sixMonths: Array.isArray(countsData.sixMonths) ? countsData.sixMonths[0] : 0,
      threeMonths: Array.isArray(countsData.threeMonths) ? countsData.threeMonths[0] : 0,
      oneMonth: Array.isArray(countsData.oneMonth) ? countsData.oneMonth[0] : 0,
      oneWeek: Array.isArray(countsData.oneWeek) ? countsData.oneWeek[0] : 0,
      safeBatches: Array.isArray(countsData.safeBatches) ? countsData.safeBatches[0] : 0,

      // Store quantity information from the second element of each array
      sixMonthsQuantity: Array.isArray(countsData.sixMonths) && countsData.sixMonths.length > 1 ? countsData.sixMonths[1] : 0,
      threeMonthsQuantity: Array.isArray(countsData.threeMonths) && countsData.threeMonths.length > 1 ? countsData.threeMonths[1] : 0,
      oneMonthQuantity: Array.isArray(countsData.oneMonth) && countsData.oneMonth.length > 1 ? countsData.oneMonth[1] : 0,
      oneWeekQuantity: Array.isArray(countsData.oneWeek) && countsData.oneWeek.length > 1 ? countsData.oneWeek[1] : 0,
      safeBatchesQuantity: Array.isArray(countsData.safeBatches) && countsData.safeBatches.length > 1 ? countsData.safeBatches[1] : 0
    };
  };

  // Function to transform stock counts from WebSocket/API
  const transformStockCounts = (data = {}) => {
    // Extract data from response
    const stockData = data.data || data;

    // Process stock summary data
    const summary = {
      totalStock: stockData.totalStock || 0,
      available: stockData.availableStock || 0,
      lowStock: stockData.lowStock || 0,
      outOfStock: stockData.outOfStock || 0
    };

    // Transform low stock product items
    const lowItems = Array.isArray(stockData.lowStockProducts)
      ? stockData.lowStockProducts.map(product => ({
        name: product.productName || 'Unknown Product',
        quantity: product.quantity || 0,
        supplier: product.supplierName || 'Unknown Supplier'
      }))
      : [];

    // Transform out of stock product items
    const outItems = Array.isArray(stockData.outOfStockProducts)
      ? stockData.outOfStockProducts.map(product => ({
        name: product.productName || 'Unknown Product',
        quantity: product.quantity || 0,
        supplier: product.supplierName || 'Unknown Supplier'
      }))
      : [];

    return { summary, lowItems, outItems };
  };

  // Add this new function to format expiryTrend data for charts
  // Make sure this function is well-defined
  const formatExpiryTrendForChart = (data) => {
    if (!data) return [];

    // Create array from our object data with appropriate format for the chart
    return [
      { name: 'Safe Batches', value: data.safeBatchesQuantity || 0, color: '#34D399' },
      { name: 'Within 6 Months', value: data.sixMonthsQuantity || 0, color: '#4D96FF' },
      { name: 'Within 3 Months', value: data.threeMonthsQuantity || 0, color: '#6BCB77' },
      { name: 'Within 1 Month', value: data.oneMonthQuantity || 0, color: '#FFD93D' },
      { name: 'Within 1 Week', value: data.oneWeekQuantity || 0, color: '#FF6B6B' }
    ];
  };

  

  // Fetch initial data and setup WebSockets
  useEffect(() => {
    let expiryWsClient = null;
    let stockWsClient = null;
    let dashboardWsClient = null;

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make sure token is valid
        if (!token) {
          setError('Authentication token is missing');
          setLoading(false);
          return;
        }

        // Fetch expiry counts
        const expiryResponse = await axios.get('http://localhost:8090/api/batch-inventory/expiry-counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: false
        });

        // Fetch stock availability
        const stockResponse = await axios.get('http://localhost:8090/api/batch-inventory/stock-counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: false
        });

        const dashboardResponse = await axios.get('http://localhost:8090/api/employee/dashboard/counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: false
        });

        // Process expiry data
        if (expiryResponse.data) {
          const transformedData = transformExpiryCounts(expiryResponse.data);
          setCounts(transformedData);
          setExpiryTrend(transformedData); // Make sure this line is here
        }

        // Process stock data
        if (stockResponse.data) {
          const { summary, lowItems, outItems } = transformStockCounts(stockResponse.data);
          setStockSummary(summary);
          setLowStockItems(lowItems);
          setOutOfStockItems(outItems);
        }

        if (dashboardResponse.data && dashboardResponse.data.data) {
          const counts = dashboardResponse.data.data;
          setDashboardCounts({
            productCount: counts.productCount || 0,
            supplierCount: counts.supplierCount || 0,
            customerCount: counts.customerCount || 0,
            expiredStockQuantity: counts.expiredStockQuantity || 0,
            recentTransactions: counts.recentTransactions || 0
          });
        }

      } catch (error) {
        // Better error handling
        let errorMessage = 'Failed to load dashboard data';

        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.response.status === 403) {
            errorMessage = 'You do not have permission to access this data.';
          }
          console.error('Server response:', error.response.data);
        }

        setError(errorMessage);
        console.error('API Error:', error);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Setup WebSocket for expiry counts
    try {
      expiryWsClient = webSocketConnections.connectExpiryCounts(token, (newCounts) => {
        console.log("WebSocket received new expiry data:", newCounts);
        const transformedData = transformExpiryCounts(newCounts);
        setCounts(transformedData);
        setExpiryTrend(transformedData); // Make sure we also update expiryTrend here
        if (!toast.isActive("expiry-update")) {
          toast.info('Expiry counts updated!', {
            toastId: "expiry-update",
            autoClose: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error connecting to expiry WebSocket:', error);
      toast.error('Failed to establish real-time expiry connection');
    }

    // Setup WebSocket for stock counts
    try {
      stockWsClient = webSocketConnections.connectStockCounts(token, (newStockData) => {
        const { summary, lowItems, outItems } = transformStockCounts(newStockData);
        setStockSummary(summary);
        setLowStockItems(lowItems);
        setOutOfStockItems(outItems);
        if (!toast.isActive("stock-update")) {
          toast.info('Stock counts updated!', {
            toastId: "stock-update",
            autoClose: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error connecting to stock WebSocket:', error);
      toast.error('Failed to establish real-time stock connection');
    }

    try {
      dashboardWsClient = webSocketConnections.connectDashboardCounts(token, (dashboardData) => {
        console.log("WebSocket received new dashboard counts:", dashboardData);

        // Check if we have valid data
        if (dashboardData && dashboardData.data) {
          const counts = dashboardData.data;

          setDashboardCounts(prev => ({
            productCount: counts.productCount ?? prev.productCount,
            supplierCount: counts.supplierCount ?? prev.supplierCount,
            customerCount: counts.customerCount ?? prev.customerCount,
            recentTransactions: prev.recentTransactions // Maintain existing value
          }));

          if (!toast.isActive("dashboard-update")) {
            toast.info('Dashboard counts updated!', {
              toastId: "dashboard-update",
              autoClose: 2000
            });
          }
        }
      });
    } catch (error) {
      console.error('Error connecting to dashboard WebSocket:', error);
    }


    // Clean up WebSocket connections
    return () => {
      if (expiryWsClient) {
        disconnectWebSocket(expiryWsClient)
          .catch(error => console.error('Error disconnecting expiry WebSocket:', error));
      }

      if (stockWsClient) {
        disconnectWebSocket(stockWsClient)
          .catch(error => console.error('Error disconnecting stock WebSocket:', error));
      }

      if (dashboardWsClient) {
        disconnectWebSocket(dashboardWsClient)
          .catch(error => console.error('Error disconnecting dashboard WebSocket:', error));
      }
    };
  }, [token]);


  // Dynamic pie chart data calculation - now using quantities for percentages
  const getExpiryDistribution = () => {
    if (!counts) return []; // Add defensive check

    // Calculate total units (quantities)
    const totalQuantity =
      (counts.sixMonthsQuantity || 0) +
      (counts.threeMonthsQuantity || 0) +
      (counts.oneMonthQuantity || 0) +
      (counts.oneWeekQuantity || 0) +
      (counts.safeBatchesQuantity || 0);

    if (totalQuantity === 0) return [];

    return [
      {
        name: 'Safe Batches',
        value: counts.safeBatchesQuantity || 0,
        batches: counts.safeBatches || 0
      },
      {
        name: 'Within 6 Months',
        value: counts.sixMonthsQuantity || 0,
        batches: counts.sixMonths || 0
      },
      {
        name: 'Within 3 Months',
        value: counts.threeMonthsQuantity || 0,
        batches: counts.threeMonths || 0
      },
      {
        name: 'Within 1 Month',
        value: counts.oneMonthQuantity || 0,
        batches: counts.oneMonth || 0
      },
      {
        name: 'Within 1 Week',
        value: counts.oneWeekQuantity || 0,
        batches: counts.oneWeek || 0
      }
    ];
  };

  // Updated to include a color for Safe Batches
  const COLORS = ['#34D399', '#4D96FF', '#6BCB77', '#FFD93D', '#FF6B6B'];

  // Enhanced Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && counts) {
      const totalQuantity =
        (counts.sixMonthsQuantity || 0) +
        (counts.threeMonthsQuantity || 0) +
        (counts.oneMonthQuantity || 0) +
        (counts.oneWeekQuantity || 0) +
        (counts.safeBatchesQuantity || 0);

      const data = payload[0].payload;
      const percent = totalQuantity > 0 ? ((data.value / totalQuantity) * 100).toFixed(1) : 0;

      return (
        <div className="p-3 text-white bg-gray-900 rounded-lg shadow-lg">
          <p className="font-semibold mb-1" style={{ color: payload[0].color }}>
            {data.name}
          </p>
          <table className="text-sm">
            <tbody>
              <tr>
                <td className="pr-3 text-gray-300">Batches:</td>
                <td className="text-right font-medium">{data.batches}</td>
              </tr>
              <tr>
                <td className="pr-3 text-gray-300">Units:</td>
                <td className="text-right font-medium">{data.value}</td>
              </tr>
              <tr>
                <td className="pr-3 text-gray-300">Percentage:</td>
                <td className="text-right font-medium">{percent}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  // Tooltip for bar chart
  const BarChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 text-white bg-gray-900 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{payload[0].value} units</p>
        </div>
      );
    }
    return null;
  };

  // Custom label placement function
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className={`flex-grow text-[var(--text-color)] ${className || ''}`}>
      {/* Display error message if there's an error */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
          <h3 className="text-red-800 font-medium">{error.title}</h3>
          <p className="text-red-700">{error.message}</p>
          <details className="mt-2">
            <summary className="text-sm text-gray-600 cursor-pointer">Technical details</summary>
            <p className="text-xs text-gray-500 mt-1">{error.technical}</p>
          </details>
        </div>
      )}

      {/* Display loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
              <div className="p-3 mr-4 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m-8 4l8-4"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Active Products</p>
                <p className="text-2xl font-semibold text-gray-800">{dashboardCounts.productCount}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
              <div className="p-3 mr-4 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Suppliers</p>
                <p className="text-2xl font-semibold text-gray-800">{dashboardCounts.supplierCount}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
              <div className="p-3 mr-4 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <p className="text-2xl font-semibold text-gray-800">{dashboardCounts.customerCount}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
              <div className="p-3 mr-4 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Transactions</p>
                <p className="text-2xl font-semibold text-gray-800">{dashboardCounts.recentTransactions}</p>
              </div>
            </div>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
            {/* Stock Availability Display */}
            <div className="p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text">
                Stock Availability
              </h2>
              <div className="mb-4">
                <p className="text-lg font-bold">{stockSummary.totalStock + (dashboardCounts.expiredStockQuantity || 0)}</p>
                <p className="text-sm text-gray-600">Total Stock (Including Expired)</p>
              </div>

              {/* New horizontal stacked bar */}
              <div className="relative flex w-full h-8 mb-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-l-full"
                  style={{
                    width: `${(stockSummary.totalStock + (dashboardCounts.expiredStockQuantity || 0)) > 0
                      ? (stockSummary.totalStock / (stockSummary.totalStock + (dashboardCounts.expiredStockQuantity || 0)) * 100)
                      : 0}%`
                  }}
                ></div>
                <div
                  className="h-full bg-rose-500 rounded-r-full"
                  style={{
                    width: `${(stockSummary.totalStock + (dashboardCounts.expiredStockQuantity || 0)) > 0
                      ? ((dashboardCounts.expiredStockQuantity || 0) / (stockSummary.totalStock + (dashboardCounts.expiredStockQuantity || 0)) * 100)
                      : 0}%`
                  }}
                ></div>
                {/* Overlay text for exact quantities */}
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-semibold text-white">
                  <span className="px-2 py-1 bg-blue-600 rounded bg-opacity-80">
                    {stockSummary.totalStock} <span className="hidden sm:inline">valid</span>
                  </span>
                  <span className="px-2 py-1 bg-rose-600 rounded bg-opacity-80">
                    {dashboardCounts.expiredStockQuantity || 0} <span className="hidden sm:inline">expired</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-1 mb-6 text-xs text-gray-600">
                <span>Valid Stock</span>
                <span>Expired Stock</span>
              </div>

              {/* Stock Trend Over Time */}
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Stock Trend - Last 6 Months</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={stockTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="available" stackId="1" stroke="#4ade80" fill="#4ade80" />
                    <Area type="monotone" dataKey="lowStock" stackId="1" stroke="#fb923c" fill="#fb923c" />
                    <Area type="monotone" dataKey="outOfStock" stackId="1" stroke="#f87171" fill="#f87171" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Low Stock Items List */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Low Stock Items</h3>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    {lowStockItems.length} Items
                  </span>
                </div>
                {lowStockItems.length > 0 ? (
                  <div className="mt-2 overflow-y-auto max-h-32">
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-1 text-sm border-b border-gray-100">
                        <span className="truncate max-w-[140px]">{item.name}</span>
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded">
                          {item.quantity} units
                        </span>
                        <span className="text-xs text-gray-600 truncate max-w-[100px]">{item.supplier}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No low stock items</p>
                )}
              </div>
            </div>

            {/* Expiry Distribution with enhanced visualizations */}
            <div className="p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Expiry Analysis
              </h2>

              {/* Expiry Distribution Pie Chart */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Distribution by Expiry Category</h3>
              </div>
              {getExpiryDistribution().length > 0 ? (
                <ResponsiveContainer width="100%" height={250}> {/* Increased height */}
                  <PieChart>
                    <Pie
                      data={getExpiryDistribution()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false} // Disable label lines
                      label={({ percent }) => percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ''} // Only show inside labels for large segments
                    >
                      {getExpiryDistribution().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconSize={10}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  No expiry data available
                </div>
              )}


              {/* Expiry Quantities Bar Chart */}
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Expiry Quantities by Category</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={formatExpiryTrendForChart(counts)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[0, dataMax => Math.max(20, dataMax * 1.1)]}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip content={<BarChartTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {formatExpiryTrendForChart(counts).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <ReferenceLine
                      x={20}
                      stroke="#ff0000"
                      strokeDasharray="3 3"
                      label={{ value: "Critical", position: "insideBottomRight", fill: "#ff0000", fontSize: 10 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Critical Expiry Alert */}
              {counts.oneWeekQuantity > 0 && (
                <div className="p-3 mt-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium">Critical Alert: {counts.oneWeek} batches ({counts.oneWeekQuantity} units) expiring within 1 week!</span>
                  </div>
                  <p className="mt-1 ml-7">Review soon-to-expire inventory immediately to minimize losses.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Stock Status Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md hover:shadow-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-green-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-green-800">Products Not Near Reorder Limits</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-green-900">{stockSummary.available}</p>
                    <span className="ml-2 text-xs text-green-700">
                      products
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 mt-3 bg-green-200 rounded-full">
                <div
                  className="h-1 bg-green-500 rounded-full"
                  style={{
                    width: `${stockSummary.totalStock > 0 ? (stockSummary.available / stockSummary.totalStock * 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 transition-all duration-300 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-md hover:shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-yellow-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-yellow-800">Products At/Below Reorder Limits</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-yellow-900">{stockSummary.lowStock}</p>
                    <span className="ml-2 text-xs text-yellow-700">
                      products
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 mt-3 bg-yellow-200 rounded-full">
                <div
                  className="h-1 bg-yellow-500 rounded-full"
                  style={{
                    width: `${stockSummary.totalStock > 0 ? (stockSummary.lowStock / stockSummary.totalStock * 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 transition-all duration-300 bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-md hover:shadow-lg border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-red-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-red-800">
                    Products <span className="font-semibold">Out of Stock</span>
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-red-900">{stockSummary.outOfStock}</p>
                    <span className="ml-2 text-xs text-red-700">
                      products
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 mt-3 bg-red-200 rounded-full">
                <div
                  className="h-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    width: `${stockSummary.totalStock > 0 ? (stockSummary.outOfStock / stockSummary.totalStock * 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 transition-all duration-300 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-md hover:shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-purple-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-purple-800">Batches to Return</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-purple-900">{returnBatches.count}</p>
                    <span className="ml-2 text-xs text-purple-700">
                      batches
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 mt-3 bg-purple-200 rounded-full">
                <div className="h-1 bg-purple-500 rounded-full" style={{ width: returnBatches.count > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>

          </div>

          {/* Required content from props */}
          <div>{content}</div>
        </>
      )}
    </div>
  );
};

EmployeeDashboardCard.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string
};

export default EmployeeDashboardCard;