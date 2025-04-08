import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllBatchInventories } from '../../../../../api/InventoryApiService';

const ExpiryDistribution = () => {
  // State for storing inventory data and filters
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);
  const [daysFromToday, setDaysFromToday] = useState(0); // New state for custom filter
  const [useCustomFilter, setUseCustomFilter] = useState(false); // Toggle for custom filter

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
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

  // Get items for display based on filters
  const displayItems = useMemo(() => {
    if (!inventory.length) return [];
    
    // Custom days from today filter
    if (useCustomFilter) {
      return inventory.filter(item => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
        return daysUntilExpiry <= daysFromToday;
      });
    }
    
    if (showExpiredOnly) {
      return inventory.filter(item => categorizeByExpiry(item) === 'expired');
    }
    
    if (selectedTimeframe === 'all') {
      return inventory;
    }

    return inventory.filter(item => categorizeByExpiry(item) === selectedTimeframe);
  }, [inventory, selectedTimeframe, categorizeByExpiry, showExpiredOnly, useCustomFilter, daysFromToday, getDaysUntilExpiry]);

  // Stats calculations
  const expiryStats = useMemo(() => {
    if (!inventory.length) return {
      expired: 0,
      oneWeek: 0,
      oneMonth: 0,
      threeMonths: 0,
      sixMonths: 0,
      beyondSixMonths: 0
    };

    return inventory.reduce((acc, item) => {
      const category = categorizeByExpiry(item);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {
      expired: 0,
      oneWeek: 0,
      oneMonth: 0,
      threeMonths: 0,
      sixMonths: 0,
      beyondSixMonths: 0
    });
  }, [inventory, categorizeByExpiry]);

  const handleCustomFilterChange = (e) => {
    const days = parseInt(e.target.value) || 0;
    setDaysFromToday(days);
    
    // Enable custom filter when days > 0
    if (days > 0) {
      setUseCustomFilter(true);
      setShowExpiredOnly(false);
      setSelectedTimeframe('all');
    } else {
      setUseCustomFilter(false);
    }
  };

  if (loading) {
    return <div className='py-5 text-center'>Loading inventory data...</div>;
  }

  if (error) {
    return <div className='py-5 text-center text-red-600'>{error}</div>;
  }

  return (
    <div className='container p-3 mx-auto'>
      <div className="flex items-center justify-between mb-3">
        <h1 className='text-xl font-bold text-[#1a5353]'>
          Inventory Expiry Distribution
        </h1>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
            <span className="font-semibold">{expiryStats.expired}</span> expired items
          </div>
        </div>
      </div>

      {/* Expiry Timeline Dashboard */}
      <div className="bg-[#e6eef3] p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#1a5353] mb-3">Expiry Timeline Overview</h2>
        
        <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-red-800">Expired</div>
            <div className="text-xl font-bold text-red-700">{expiryStats.expired}</div>
            <div className="mt-1 text-xs text-red-600">items</div>
          </div>
          
          <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-orange-800">Within 7 Days</div>
            <div className="text-xl font-bold text-orange-700">{expiryStats.oneWeek}</div>
            <div className="mt-1 text-xs text-orange-600">items</div>
          </div>
          
          <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-yellow-800">Within 30 Days</div>
            <div className="text-xl font-bold text-yellow-700">{expiryStats.oneMonth}</div>
            <div className="mt-1 text-xs text-yellow-600">items</div>
          </div>
          
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-blue-800">Within 90 Days</div>
            <div className="text-xl font-bold text-blue-700">{expiryStats.threeMonths}</div>
            <div className="mt-1 text-xs text-blue-600">items</div>
          </div>
          
          <div className="p-3 bg-teal-100 border border-teal-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-teal-800">Within 180 Days</div>
            <div className="text-xl font-bold text-teal-700">{expiryStats.sixMonths}</div>
            <div className="mt-1 text-xs text-teal-600">items</div>
          </div>
          
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
            <div className="mb-1 text-xs font-medium text-green-800">Beyond 180 Days</div>
            <div className="text-xl font-bold text-green-700">{expiryStats.beyondSixMonths}</div>
            <div className="mt-1 text-xs text-green-600">items</div>
          </div>
        </div>
        
        {/* Expiry Timeline Chart (visual representation) */}
        <div className="flex w-full h-8 mb-4 overflow-hidden rounded">
          <div 
            className="h-full bg-red-600" 
            style={{width: `${expiryStats.expired / inventory.length * 100}%`}}
            title={`Expired: ${expiryStats.expired} items`}
          ></div>
          <div 
            className="h-full bg-orange-500" 
            style={{width: `${expiryStats.oneWeek / inventory.length * 100}%`}}
            title={`Within 7 days: ${expiryStats.oneWeek} items`}
          ></div>
          <div 
            className="h-full bg-yellow-500" 
            style={{width: `${expiryStats.oneMonth / inventory.length * 100}%`}}
            title={`Within 30 days: ${expiryStats.oneMonth} items`}
          ></div>
          <div 
            className="h-full bg-blue-500" 
            style={{width: `${expiryStats.threeMonths / inventory.length * 100}%`}}
            title={`Within 90 days: ${expiryStats.threeMonths} items`}
          ></div>
          <div 
            className="h-full bg-teal-500" 
            style={{width: `${expiryStats.sixMonths / inventory.length * 100}%`}}
            title={`Within 180 days: ${expiryStats.sixMonths} items`}
          ></div>
          <div 
            className="h-full bg-green-500" 
            style={{width: `${expiryStats.beyondSixMonths / inventory.length * 100}%`}}
            title={`Beyond 180 days: ${expiryStats.beyondSixMonths} items`}
          ></div>
        </div>
      </div>

      {/* Filter Section */}
      <div className='bg-[#e6eef3] p-4 rounded-lg shadow-sm mb-4'>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-3">
              <label className="block text-[#1a5353] font-medium mb-1">Filter by expiry timeframe:</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => {
                  setSelectedTimeframe(e.target.value);
                  setShowExpiredOnly(false);
                  setUseCustomFilter(false);
                }}
                className='w-full p-2 text-sm border border-gray-300 rounded'
                disabled={useCustomFilter}
              >
                <option value='all'>All Items</option>
                <option value='expired'>Expired Items</option>
                <option value='oneWeek'>Expiring in 1 Week</option>
                <option value='oneMonth'>Expiring in 1 Month</option>
                <option value='threeMonths'>Expiring in 3 Months</option>
                <option value='sixMonths'>Expiring in 6 Months</option>
                <option value='beyondSixMonths'>Beyond 6 Months</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showExpiredOnly} 
                  onChange={() => {
                    setShowExpiredOnly(!showExpiredOnly);
                    if (!showExpiredOnly) {
                      setSelectedTimeframe('all');
                      setUseCustomFilter(false);
                    }
                  }}
                  className="mr-2 h-4 w-4 accent-[#1a5353]"
                  disabled={useCustomFilter}
                />
                <span className="text-sm font-medium">Show Expired Items Only</span>
              </label>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <label className="block text-[#1a5353] font-medium mb-1">Custom filter: Items expiring within X days</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={daysFromToday}
                  onChange={handleCustomFilterChange}
                  min="0"
                  max="1000"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded"
                  placeholder="Enter number of days"
                />
                <button
                  onClick={() => {
                    setUseCustomFilter(false);
                    setDaysFromToday(0);
                  }}
                  className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  disabled={!useCustomFilter}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="text-sm italic text-gray-600">
              {useCustomFilter ? 
                `Showing items expiring within the next ${daysFromToday} days` : 
                "Enter a number of days to filter items expiring within that timeframe"}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with Compact Title */}
      <div>
        <div className="bg-[#1a5353] text-white px-3 py-1.5 rounded flex justify-between items-center mb-2">
          <h2 className='text-sm font-semibold'>
            {useCustomFilter
              ? `Items Expiring Within ${daysFromToday} Days`
              : showExpiredOnly 
                ? 'Expired Items' 
                : selectedTimeframe === 'all'
                  ? 'All Inventory Items'
                  : `Items ${selectedTimeframe === 'expired' 
                      ? 'Expired' 
                      : selectedTimeframe === 'beyondSixMonths'
                        ? 'Expiring Beyond 6 Months'
                        : 'Expiring'} ${
                      selectedTimeframe === 'oneWeek'
                        ? 'Within 1 Week'
                        : selectedTimeframe === 'oneMonth'
                          ? 'Within 1 Month'
                          : selectedTimeframe === 'threeMonths'
                            ? 'Within 3 Months'
                            : selectedTimeframe === 'sixMonths'
                              ? 'Within 6 Months'
                              : ''
                    }`}
          </h2>
          <span className="text-xs bg-white text-[#1a5353] px-2 py-0.5 rounded-full">
            {displayItems.length} items
          </span>
        </div>

        {displayItems.length === 0 ? (
          <div className='py-4 text-sm text-center bg-gray-100 rounded'>
            No items found matching the selected criteria.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm bg-white border border-gray-300 rounded-md'>
              <thead className='bg-[#ffb24d] text-[#5e5757]'>
                <tr>
                  <th className='px-2 py-1.5 text-left border-b'>Product Name</th>
                  <th className='px-2 py-1.5 text-left border-b'>Batch No</th>
                  <th className='px-2 py-1.5 text-left border-b'>Expiry Date</th>
                  <th className='px-2 py-1.5 text-left border-b'>Days Until Expiry</th>
                  <th className='px-2 py-1.5 text-left border-b'>Stock Qty</th>
                  <th className='px-2 py-1.5 text-left border-b'>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, index) => {
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
                    statusText = `${Math.floor(daysUntilExpiry / 7)} weeks`;
                    statusClass = 'text-yellow-600';
                  } else if (daysUntilExpiry <= 90) {
                    statusText = `${Math.floor(daysUntilExpiry / 30)} months`;
                    statusClass = 'text-blue-600';
                  } else {
                    statusText = `${Math.floor(daysUntilExpiry / 30)} months`;
                    statusClass = 'text-green-600';
                  }

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className='px-2 py-1 border-b'>{item.productName}</td>
                      <td className='px-2 py-1 border-b'>{item.batchNo}</td>
                      <td className='px-2 py-1 border-b'>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className='px-2 py-1 border-b'>
                        {daysUntilExpiry <= 0 ? 
                          <span className="font-medium text-red-600">{daysUntilExpiry}</span> : 
                          daysUntilExpiry}
                      </td>
                      <td className='px-2 py-1 border-b'>
                        {item.stockQuantity}
                      </td>
                      <td
                        className={`py-1 px-2 border-b font-medium ${statusClass}`}
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
