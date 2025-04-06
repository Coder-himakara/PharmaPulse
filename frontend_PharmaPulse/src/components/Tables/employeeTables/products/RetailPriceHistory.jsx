import { useState, useEffect } from 'react';
import apiClient from '../../../../api/ApiClient';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { X } from 'lucide-react'; // Lucide icon for "Close"
Chart.register(...registerables);

// Helper to format date
const formatDate = (dateVal) => {
  if (Array.isArray(dateVal)) {
    const [year, month, day, hours = 0, minutes = 0] = dateVal;
    return new Date(year, month - 1, day, hours, minutes).toLocaleDateString();
  }
  const d = new Date(dateVal);
  return isNaN(d) ? 'Invalid date' : d.toLocaleDateString();
};

const RetailPriceHistory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products/all');
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products list');
      }
    };
    fetchProducts();
  }, []);

  // Filter products for autocomplete
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/products/wholesale-prices/${selectedProductId}`
      );
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
      );
      setPriceData(sortedData);
      setError('');
    } catch (err) {
      console.error('Error fetching price history:', err);
      setError('Failed to fetch price history');
      setPriceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId, productName) => {
    setSelectedProductId(productId);
    setSearchTerm(productName);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProductId) fetchPriceHistory();
  };

  const handleClose = () => {
    // Custom close behavior (e.g., hide component, navigate away)
    window.history.back(); // or navigate to another page
  };

  const chartData = {
    labels: priceData.map((item) => formatDate(item.effectiveDate)),
    datasets: [
      {
        label: 'Wholesale Price History',
        data: priceData.map((item) => item.wholesalePrice),
        borderColor: '#1a5353',
        backgroundColor: 'rgba(26, 83, 83, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg p-6 relative'>

      {/* Close Icon */}
      <button
        onClick={handleClose}
        className='absolute top-4 right-4 text-[#5e5757] hover:text-[#1a5353] transition'
        title='Close'
      >
        <X size={24} />
      </button>

      <h2 className='text-2xl font-bold text-[#1a5353] mb-4'>
        Retail Price History
      </h2>

      <form onSubmit={handleSubmit} className='mb-6 relative'>
        <input
          type='text'
          placeholder='Search Product by Name'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedProductId('');
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          className='w-full px-4 py-2 border border-[#bfb6b6] rounded-md focus:outline-none'
        />
        {showSuggestions && filteredProducts.length > 0 && (
          <ul className='absolute z-10 w-full bg-white border border-[#bfb6b6] rounded-md mt-1 max-h-60 overflow-y-auto'>
            {filteredProducts.map((product) => (
              <li
                key={product.productId}
                onMouseDown={() =>
                  handleSelectProduct(product.productId, product.productName)
                }
                className='px-4 py-2 cursor-pointer hover:bg-[#e6eef3]'
              >
                {product.productName}
              </li>
            ))}
          </ul>
        )}
        <button
          type='submit'
          className='mt-4 w-full bg-[#ffb24d] text-[#5e5757] px-6 py-2 rounded-md hover:bg-[#e0a83d] transition'
        >
          {loading ? 'Loading...' : 'Get History'}
        </button>
      </form>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      {priceData.length > 0 && (
        <>
          <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
            <h3 className='text-xl font-semibold text-[#1a5353]'>
              Current Price
            </h3>
            <p className='text-4xl font-bold text-[#2a9d8f] mt-2'>
              Rs.{priceData[0].wholesalePrice.toFixed(2)}
              <span className='text-sm text-[#5e5757] ml-2'>
                (Effective from {formatDate(priceData[0].effectiveDate)})
              </span>
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white rounded-lg shadow-md flex flex-col'>
              <div className='bg-[#1a5353] text-white px-4 py-2'>
                Price History Table
              </div>
              <div
                className='p-4 overflow-y-auto'
                style={{ maxHeight: '400px' }}
              >
                <table className='w-full text-sm'>
                  <thead className='bg-[#ffb24d] text-[#5e5757]'>
                    <tr>
                      <th className='p-2'>Effective Date</th>
                      <th className='p-2'>End Date</th>
                      <th className='p-2'>Price (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((item, index) => (
                      <tr
                        key={item.priceId}
                        className={`border-t border-[#bfb6b6] ${index === 0 ? 'bg-[#c6dceb]' : 'bg-white'}`}
                      >
                        <td className='p-2'>{formatDate(item.effectiveDate)}</td>
                        <td className='p-2'>
                          {item.endDate ? formatDate(item.endDate) : 'Present'}
                        </td>
                        <td className='p-2'>
                          {item.wholesalePrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md flex flex-col'>
              <div className='bg-[#1a5353] text-white px-4 py-2'>
                Price Trend Chart
              </div>
              <div className='p-4 overflow-x-auto' style={{ maxHeight: '400px' }}>
                <div style={{ minWidth: '600px' }}>
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'Price (Rs)',
                            color: '#5e5757',
                          },
                          ticks: { color: '#5e5757' },
                          grid: { color: '#e6eef3' },
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Date',
                            color: '#5e5757',
                          },
                          ticks: { color: '#5e5757' },
                          grid: { color: '#e6eef3' },
                        },
                      },
                      plugins: {
                        legend: { labels: { color: '#5e5757' } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RetailPriceHistory;
