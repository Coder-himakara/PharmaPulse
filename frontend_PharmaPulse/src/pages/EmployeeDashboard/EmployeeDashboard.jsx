'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import Navbar from '../../components/Navbar/EmployeeNavbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Footer from '../../components/Footer/Footer';
import EmpRoutes from '../../routes/EmpRoutes';

// Sample data for the order status (replace with real data)
const orderStatus = {
  availableOrders: 13,
  time: '12:33 PM',
  repId: 'LG-7782',
  repName: 'Santh',
};

// Data for available orders (for Available Orders chart)
const orderData = [
  { category: 'Pending', value: 50, fill: '#10b981' }, // Green (emerald-500)
  { category: 'Processing', value: 30, fill: '#f59e0b' }, // Yellow (amber-500)
  { category: 'Ready', value: 20, fill: '#3b82f6' }, // Blue (from your original chart)
];

// Chart component for Available Orders
const OrderChartComponent = () => {
  const totalOrders = React.useMemo(() => {
    return orderData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <div className='relative p-6'>
      <div className='fixed left-0 mt-10 mr-4 top-10'>
        {' '}
        {/* Fixed position, 4 units of margin */}
        <PieChart width={300} height={250}>
          <Pie
            data={orderData}
            dataKey='value'
            nameKey='category'
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor='middle'
                      dominantBaseline='middle'
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className='text-3xl font-bold fill-gray-900'
                      >
                        {totalOrders.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className='fill-gray-500'
                      >
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <div className='bg-gray-10 '>
      {/* Order Status Banner (Narrower, Centered, Single Line) */}
      <div className='container px-4 py-2 mx-auto'>
        <div className='flex items-center justify-start p-2 space-x-2 text-black bg-blue-500 rounded-lg shadow'>
          <span className='font-bold'>
            {orderStatus.availableOrders} Order(s) Available
          </span>
          <span>{orderStatus.time}</span>
          <span className='flex items-center'>
            <User className='w-4 h-4 mr-1' /> {orderStatus.repId}{' '}
            {orderStatus.repName}
          </span>
        </div>
      </div>

      <Navbar />
      <div className='container px-4 py-6 mx-auto'>
        <DashboardCard
          content={
            <div className='space-y-6'>
              <EmpRoutes />
              <OrderChartComponent />
            </div>
          }
          className='p-4 bg-black rounded-lg shadow'
        />
      </div>
      <Footer className='py-4 text-center text-gray-600 bg-gray-200' />
    </div>
  );
};

export default EmployeeDashboard;
