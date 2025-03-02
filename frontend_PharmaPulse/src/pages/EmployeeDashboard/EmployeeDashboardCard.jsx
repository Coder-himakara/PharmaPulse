/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// DashboardCard Component
const EmployeeDashboardCard = ({ content}) => {
  // Sample data with multiple categories for grouped bar chart
  const stockData = [
    { month: 'Jan', inStock: 120, lowStock: 20 },
    { month: 'Feb', inStock: 150, lowStock: 15 },
    { month: 'Mar', inStock: 100, lowStock: 30 },
    { month: 'Apr', inStock: 130, lowStock: 25 },
    { month: 'May', inStock: 110, lowStock: 35 },
    { month: 'Jun', inStock: 140, lowStock: 10 },
    { month: 'Jul', inStock: 120, lowStock: 20 },
    { month: 'Aug', inStock: 150, lowStock: 75 },
    { month: 'Sep', inStock: 150, lowStock: 30 },
    { month: 'Oct', inStock: 130, lowStock: 25 },
    { month: 'Nov', inStock: 110, lowStock: 35 },
    { month: 'Dec', inStock: 190, lowStock: 10 },
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
          {/* Stock Level Grouped Bar Chart */}
          <div className='p-6 transition-transform duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105'>
            <h2 className='mb-4 text-xl font-semibold text-transparent text-gray-800 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text'>
              Stock Levels 
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="inStock" 
                  fill="#1E5F2A" 
                  name="In Stock" 
                  barSize={20} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
                <Bar 
                  dataKey="lowStock" 
                  fill="#FF8080" 
                  name="Low Stock" 
                  barSize={20} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expiry Date Doughnut Chart */}
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

        {/* Quantity Indicators */}
        <div className='grid grid-cols-2 gap-4 mb-8 md:grid-cols-4'>
          <div className='p-4 text-center transition-colors duration-200 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200'>
            <p className='text-sm text-blue-800'>6 Months Expire</p>
            <p className='text-2xl font-bold text-blue-900'>{quantityData.sixMonths}</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-green-100 rounded-lg shadow-md hover:bg-green-200'>
            <p className='text-sm text-green-800'>3 Months Expire</p>
            <p className='text-2xl font-bold text-green-900'>{quantityData.threeMonths}</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-yellow-100 rounded-lg shadow-md hover:bg-yellow-200'>
            <p className='text-sm text-yellow-800'>1 Month Expire</p>
            <p className='text-2xl font-bold text-yellow-900'>{quantityData.oneMonth}</p>
          </div>
          <div className='p-4 text-center transition-colors duration-200 bg-red-100 rounded-lg shadow-md hover:bg-red-200'>
            <p className='text-sm text-red-800'>1 Week Expire</p>
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