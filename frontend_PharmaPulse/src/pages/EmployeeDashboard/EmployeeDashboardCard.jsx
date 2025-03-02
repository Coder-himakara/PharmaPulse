/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// DashboardCard Component
const EmployeeDashboardCard = ({ content }) => {
  // Sample data for stock availability (matching the image)
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

  const expiryData = [
    { name: 'Expired', value: 25 },
    { name: 'Within 1 Month', value: 35 },
    { name: 'Within 3 Months', value: 40 },
    { name: 'Safe', value: 60 },
  ];

  const quantityData = {
    sixMonths: 500,
    threeMonths: 250,
    oneMonth: 80,
    oneWeek: 15
  };

  const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']; // Vibrant colors

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 text-white bg-gray-900 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>{`${item.name}: ${item.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='flex-grow text-[var(--text-color)]'>
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

        {/* Expiry Date Doughnut Chart (unchanged) */}
        <div className='p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105'>
          <h2 className='mb-4 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'>
            Expiry Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expiryData}
                cx="50%"
                cy="50%"
                innerRadius={60} // Makes it a doughnut chart
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: '#666', strokeWidth: 1 }}
                animationDuration={1000}
                paddingAngle={5} // Adds spacing between segments
              >
                {expiryData.map((entry, index) => (
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
        </div>
      </div>

      {/* Quantity Indicators (unchanged) */}
      <div className='grid grid-cols-2 gap-4 mb-8 md:grid-cols-4'>
        <div className='p-4 text-center transition-colors duration-200 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200'>
          <p className='text-sm text-blue-800'>Within 6 Months Expire</p>
          <p className='text-2xl font-bold text-blue-900'>{quantityData.sixMonths}</p>
        </div>
        <div className='p-4 text-center transition-colors duration-200 bg-green-100 rounded-lg shadow-md hover:bg-green-200'>
          <p className='text-sm text-green-800'>Within 3 Months Expire</p>
          <p className='text-2xl font-bold text-green-900'>{quantityData.threeMonths}</p>
        </div>
        <div className='p-4 text-center transition-colors duration-200 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200'>
          <p className='text-sm text-yellow-800'>Within 1 Month Expire</p>
          <p className='text-2xl font-bold text-yellow-900'>{quantityData.oneMonth}</p>
        </div>
        <div className='p-4 text-center transition-colors duration-200 bg-red-100 rounded-lg shadow-md hover:bg-red-200'>
          <p className='text-sm text-red-800'>Within 1 Week Expire</p>
          <p className='text-2xl font-bold text-red-900'>{quantityData.oneWeek}</p>
        </div>
      </div>

      {/* Original Content */}
      <div>{content}</div>
    </div>
  );
};

EmployeeDashboardCard.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string
};

export default EmployeeDashboardCard;