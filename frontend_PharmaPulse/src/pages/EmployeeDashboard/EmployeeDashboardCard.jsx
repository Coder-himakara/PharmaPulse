/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { connectExpiryCounts } from '../../api/WebSocket';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../security/UseAuth';

const EmployeeDashboardCard = ({ content }) => {
  const { token } = useAuth(); // Get token from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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


  const stockSummary = {
    totalStock: 3000,
    available: 2000, // Yellow portion
    lowStock: 600,   // Orange portion
    outOfStock: 400, // White portion
  };

  // Sample data for low stock items (matching the image)
  const lowStockItems = [
    { name: 'Medicine 1', quantity: 10, supplier: 'Supplier 1' },
    { name: 'Medicine 2', quantity: 8, supplier: 'Supplier 2' },
    { name: 'Medicine 3', quantity: 5, supplier: 'Supplier 3' },
  ];

  // Function to transform API data into the required format with better handling of nested data
  const transformExpiryCounts = (data = {}) => {
    console.log('Transforming data:', data);

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
      sixMonthsQuantity: Array.isArray(countsData.sixMonths) ? countsData.sixMonths[1] : 0,
      threeMonthsQuantity: Array.isArray(countsData.threeMonths) ? countsData.threeMonths[1] : 0,
      oneMonthQuantity: Array.isArray(countsData.oneMonth) ? countsData.oneMonth[1] : 0,
      oneWeekQuantity: Array.isArray(countsData.oneWeek) ? countsData.oneWeek[1] : 0,
      safeBatchesQuantity: Array.isArray(countsData.safeBatches) ? countsData.safeBatches[1] : 0
    };
  };

  // Fetch initial data and setup WebSocket
  // Fetch initial data and setup WebSocket
  useEffect(() => {
    let wsClient = null;

    const fetchInitialCounts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make sure token is valid
        if (!token) {
          setError('Authentication token is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8090/api/batch-inventory/expiry-counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Handle CORS issues
          withCredentials: false
        });

        console.log('API response:', response);

        // Check response structure and handle accordingly
        if (response.data) {
          const transformedData = transformExpiryCounts(response.data);
          console.log('Transformed data:', transformedData);
          setCounts(transformedData);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        // Better error handling
        let errorMessage = 'Failed to load initial data';

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

    fetchInitialCounts();

    try {
      wsClient = connectExpiryCounts(token, (newCounts) => {
        console.log('WebSocket data received in component:', newCounts);
        const transformedData = transformExpiryCounts(newCounts);
        setCounts(transformedData);
        toast.info('Counts updated!', { autoClose: 2000 });
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast.error('Failed to establish real-time connection');
    }

    return () => {
      if (wsClient) {
        try {
          wsClient.deactivate();
        } catch (error) {
          console.error('Error deactivating WebSocket client:', error);
        }
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

      return (
        <div className="p-3 text-white bg-gray-900 rounded-lg shadow-lg">
          {payload.map((entry, index) => (
            <div key={index} className="mb-1 last:mb-0">
              <p className="font-semibold" style={{ color: entry.color }}>
                {entry.name}
              </p>
              <p>{entry.payload.batches} batches</p>
              <p>{entry.value} units</p>
              <p>Percentage: {((entry.value / totalQuantity) * 100).toFixed(1)}% of total units</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div className='flex-grow text-[var(--text-color)]'>
       {/* Display error message if there's an error */}
    {error && (
      <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
        <p className="font-medium">Error loading dashboard data</p>
        <p className="text-sm">{error}</p>
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

      {/* Charts Container */}
      <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2'>
        {/* Stock Availability Display (replacing Stock Levels chart) */}
        <div className='p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105'>
          <h2 className='mb-4 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text'>
            Stock Availability
          </h2>
          <div className='mb-4'>
            <p className='text-lg font-bold'>3000</p>
            <p className='text-sm text-gray-600'>Total Stock</p>
          </div>
          <div className='relative w-full h-6 bg-gray-200 rounded-full'>
            <div
              className='h-full bg-green-500 rounded-l-full'
              style={{ width: `${(stockSummary.available / stockSummary.totalStock) * 100}%` }}
            ></div>
            <div
              className='h-full'
              style={{ width: `${(stockSummary.lowStock / stockSummary.totalStock) * 100}%` }}
            ></div>
            <div
              className='h-full bg-white'
              style={{ width: `${(stockSummary.outOfStock / stockSummary.totalStock) * 100}%` }}
            ></div>
            {/* Overlay text for exact quantities */}
            <div className='absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold text-white'>
              <span className='px-1 bg-yellow-500 rounded bg-opacity-80'>{stockSummary.available}</span>
              <span className='px-1 bg-orange-500 rounded bg-opacity-80'>{stockSummary.lowStock}</span>
              <span className='px-1 bg-gray-400 rounded bg-opacity-80'>{stockSummary.outOfStock}</span>
            </div>
          </div>
          <div className='flex justify-between mt-2 text-xs text-gray-600'>
            <span>Available</span>
            <span>Low Stock</span>
            <span>Out of Stock</span>
          </div>

          {/* Low Stock Items List */}
          <div className='mt-6'>
            <h3 className='mb-2 text-sm font-semibold text-gray-800'>Low Stock</h3>
            {lowStockItems.map((item, index) => (
              <div key={index} className='flex items-center justify-between py-1 text-sm'>
                <span>{item.name}</span>
                <span>{item.quantity}</span>
                <span className='text-gray-600'>{item.supplier}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Expiry Distribution Pie Chart */}
        <div className='p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105'>
          <h2 className='mb-10 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'>
            Expiry Distribution
          </h2>
          {getExpiryDistribution().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getExpiryDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => {
                    // Only show label for segments with significant percentage
                    return percent > 0.03 ? `${name} (${(percent * 100).toFixed(0)}%)` : '';
                  }}
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
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No expiry data available
            </div>
          )}
        </div>

        {/* Quantity Indicators - Now Dynamic */}
        <div className='grid grid-cols-2 gap-4 mb-8 md:grid-cols-4'>
          <div className='p-4 text-center transition-colors duration-200 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200'>
            <p className='text-sm text-blue-800'>Within 6 Months</p>
            <p className='text-2xl font-bold text-blue-900'>{counts?.sixMonths || 0}</p>
            <p className='text-xs text-blue-700'>{counts?.sixMonthsQuantity || 0} units</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-indigo-100 rounded-lg shadow-md hover:bg-indigo-200'>
            <p className='text-sm text-indigo-800'>Within 3 Months</p>
            <p className='text-2xl font-bold text-indigo-900'>{counts?.threeMonths || 0}</p>
            <p className='text-xs text-indigo-700'>{counts?.threeMonthsQuantity || 0} units</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200'>
            <p className='text-sm text-yellow-800'>Within 1 Month</p>
            <p className='text-2xl font-bold text-yellow-900'>{counts?.oneMonth || 0}</p>
            <p className='text-xs text-yellow-700'>{counts?.oneMonthQuantity || 0} units</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-red-100 rounded-lg shadow-md hover:bg-red-200'>
            <p className='text-sm text-red-800'>Within 1 Week</p>
            <p className='text-2xl font-bold text-red-900'>{counts?.oneWeek || 0}</p>
            <p className='text-xs text-red-700'>{counts?.oneWeekQuantity || 0} units</p>
          </div>
        </div>

      </div>

      <ToastContainer position="bottom-right" />
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