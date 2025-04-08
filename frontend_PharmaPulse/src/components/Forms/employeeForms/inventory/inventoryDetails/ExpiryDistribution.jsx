import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllBatchInventories } from '../../../../../api/InventoryApiService';

const ExpiryDistribution = () => {
  // State for storing inventory data and filters
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // Use the correct service method to fetch batch inventories
        const response = await getAllBatchInventories();
        setInventory(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError('Failed to load inventory data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Function to calculate days until expiry
  const getDaysUntilExpiry = useCallback((expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Function to categorize items based on expiry
  const categorizeByExpiry = useCallback(
    (item) => {
      const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

      if (daysUntilExpiry <= 0) return 'expired';
      if (daysUntilExpiry <= 7) return 'oneWeek';
      if (daysUntilExpiry <= 30) return 'oneMonth';
      if (daysUntilExpiry <= 90) return 'threeMonths';
      if (daysUntilExpiry <= 180) return 'sixMonths';
      return 'beyondSixMonths';
    },
    [getDaysUntilExpiry],
  );

  // Get month name
  const getMonthName = (monthIndex) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthIndex];
  };

  // Filter inventory based on selected timeframe
  const filteredInventory = useMemo(() => {
    if (!inventory.length) return [];

    // For all items, just return the entire inventory
    if (selectedTimeframe === 'all') {
      return inventory;
    }

    return inventory.filter((item) => {
      const category = categorizeByExpiry(item);

      // Check if the expiry month matches current selected month
      const expiryDate = new Date(item.expiryDate);
      const expiryMonth = expiryDate.getMonth();
      const expiryYear = expiryDate.getFullYear();
      const monthMatches =
        expiryMonth === currentMonth && expiryYear === currentYear;

      if (!monthMatches) return false;

      switch (selectedTimeframe) {
        case 'expired':
          return category === 'expired';
        case 'oneWeek':
          return category === 'oneWeek';
        case 'oneMonth':
          return category === 'oneMonth';
        case 'threeMonths':
          return category === 'threeMonths';
        case 'sixMonths':
          return category === 'sixMonths';
        default:
          return false;
      }
    });
  }, [
    inventory,
    selectedTimeframe,
    currentMonth,
    currentYear,
    categorizeByExpiry,
  ]);

  // Get expired items for the first table
  const expiredItems = useMemo(() => {
    return inventory.filter((item) => categorizeByExpiry(item) === 'expired');
  }, [inventory, categorizeByExpiry]);

  // Handle month change
  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  // Handle year change
  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  // Handle timeframe filter change
  const handleTimeframeChange = (e) => {
    setSelectedTimeframe(e.target.value);
  };

  if (loading) {
    return <div className='py-10 text-center'>Loading inventory data...</div>;
  }

  if (error) {
    return <div className='py-10 text-center text-red-600'>{error}</div>;
  }

  return (
    <div className='container p-4 mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center text-[#1a5353]'>
        Inventory Expiry Distribution
      </h1>

      {/* First Table: All Expired Items */}
      <div className='mb-10'>
        <h2 className='text-xl font-semibold mb-4 bg-[#1a5353] text-white p-2 rounded'>
          All Expired Items
        </h2>

        {expiredItems.length === 0 ? (
          <div className='py-4 text-center bg-gray-100 rounded'>
            No expired items found.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300 rounded-md'>
              <thead className='bg-[#ffb24d] text-[#5e5757]'>
                <tr>
                  <th className='px-4 py-2 text-left border-b'>Product Name</th>
                  <th className='px-4 py-2 text-left border-b'>Batch No</th>
                  <th className='px-4 py-2 text-left border-b'>Expiry Date</th>
                  <th className='px-4 py-2 text-left border-b'>
                    Stock Quantity
                  </th>
                  <th className='px-4 py-2 text-left border-b'>Days Expired</th>
                </tr>
              </thead>
              <tbody>
                {expiredItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className='px-4 py-2 border-b'>{item.productName}</td>
                    <td className='px-4 py-2 border-b'>{item.batchNo}</td>
                    <td className='px-4 py-2 border-b'>
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-2 border-b'>{item.stockQuantity}</td>
                    <td className='px-4 py-2 font-medium text-red-600 border-b'>
                      {Math.abs(getDaysUntilExpiry(item.expiryDate))} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className='bg-[#e6eef3] p-4 rounded-lg shadow-sm mb-6'>
        <h2 className='text-xl font-semibold mb-4 text-[#1a5353]'>
          Filter By Expiry Timeline
        </h2>

        <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-3'>
          <div>
            <label className='block mb-1 text-gray-700'>Month:</label>
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className='w-full p-2 border border-gray-300 rounded'
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i}>
                  {getMonthName(i)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block mb-1 text-gray-700'>Year:</label>
            <select
              value={currentYear}
              onChange={handleYearChange}
              className='w-full p-2 border border-gray-300 rounded'
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className='block mb-1 text-gray-700'>
              Expiry Timeframe:
            </label>
            <select
              value={selectedTimeframe}
              onChange={handleTimeframeChange}
              className='w-full p-2 border border-gray-300 rounded'
            >
              <option value='all'>All Items</option>
              <option value='expired'>Expired Items</option>
              <option value='oneWeek'>Expiring in 1 Week</option>
              <option value='oneMonth'>Expiring in 1 Month</option>
              <option value='threeMonths'>Expiring in 3 Months</option>
              <option value='sixMonths'>Expiring in 6 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Table: Filtered by Timeframe */}
      <div>
        <h2 className='text-xl font-semibold mb-4 bg-[#1a5353] text-white p-2 rounded'>
          {selectedTimeframe === 'all'
            ? 'All Inventory Items'
            : `Items ${selectedTimeframe === 'expired' ? 'Expired' : 'Expiring'} in ${getMonthName(currentMonth)} ${currentYear}`}
        </h2>

        {filteredInventory.length === 0 ? (
          <div className='py-4 text-center bg-gray-100 rounded'>
            No items found matching the selected criteria.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300 rounded-md'>
              <thead className='bg-[#ffb24d] text-[#5e5757]'>
                <tr>
                  <th className='px-4 py-2 text-left border-b'>Product Name</th>
                  <th className='px-4 py-2 text-left border-b'>Batch No</th>
                  <th className='px-4 py-2 text-left border-b'>Expiry Date</th>
                  <th className='px-4 py-2 text-left border-b'>
                    Stock Quantity
                  </th>
                  <th className='px-4 py-2 text-left border-b'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => {
                  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                  let statusText = '';
                  let statusClass = '';

                  if (daysUntilExpiry <= 0) {
                    statusText = `Expired ${Math.abs(daysUntilExpiry)} days ago`;
                    statusClass = 'text-red-600';
                  } else if (daysUntilExpiry <= 7) {
                    statusText = `Expiring in ${daysUntilExpiry} days`;
                    statusClass = 'text-orange-600';
                  } else if (daysUntilExpiry <= 30) {
                    statusText = `Expiring in ${Math.floor(daysUntilExpiry / 7)} weeks`;
                    statusClass = 'text-yellow-600';
                  } else if (daysUntilExpiry <= 90) {
                    statusText = `Expiring in ${Math.floor(daysUntilExpiry / 30)} months`;
                    statusClass = 'text-blue-600';
                  } else {
                    statusText = `Expiring in ${Math.floor(daysUntilExpiry / 30)} months`;
                    statusClass = 'text-green-600';
                  }

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className='px-4 py-2 border-b'>{item.productName}</td>
                      <td className='px-4 py-2 border-b'>{item.batchNo}</td>
                      <td className='px-4 py-2 border-b'>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-2 border-b'>
                        {item.stockQuantity}
                      </td>
                      <td
                        className={`py-2 px-4 border-b font-medium ${statusClass}`}
                      >
                        {statusText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryDistribution;
