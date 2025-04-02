import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/ApiClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PriceListTable = () => {
  const [priceList, setPriceList] = useState([]);
  const [filteredPriceList, setFilteredPriceList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const pdfRef = useRef(); // Ref for PDF content capture

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await apiClient.get('/price-list');
        setPriceList(response.data);
        setFilteredPriceList(response.data);
      } catch (err) {
        console.error('Error fetching price list:', err);
        setError('Failed to load price list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceList();
  }, []);

  // Updated filtering to check that productName starts with the search term.
  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const results = priceList.filter((entry) =>
      String(entry.productName).toLowerCase().startsWith(searchTerm)
    );
    setFilteredPriceList(results);
  }, [search, priceList]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  const generatePDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Create a PDF in landscape mode to better accommodate the wide table.
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = 297; // A4 landscape width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`price-list_${Date.now()}.pdf`);
  };

  if (loading) return <p className='text-center p-4'>Loading price list...</p>;
  if (error) return <p className='text-red-500 text-center p-4'>{error}</p>;

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      <div className='bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative'>
        <h1 className='p-1 m-1 text-2xl'>Price List Management</h1>
        <button
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4'
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className='flex items-center justify-between p-2 m-2'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Price List</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search by Product Name...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]'
          />
        </div>
      </div>

      {filteredPriceList.length === 0 && search && (
        <div className='text-[#991919] text-sm text-center mt-2 font-bold'>
          No price list entries found matching your search.
        </div>
      )}

      {/* Price list table wrapped in a div referenced by pdfRef */}
      <div ref={pdfRef} className='p-2 m-2'>
        {filteredPriceList.length === 0 ? (
          <p className='text-center p-4'>No price list entries found.</p>
        ) : (
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Product ID
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Product Ref ID
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Purchase Group ID
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Product Name
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Generic Name
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Units per Pack
                </th>
                <th className='border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Wholesale Price (Rs)
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPriceList.map((entry, index) => (
                <tr key={index} className='bg-[#c6dceb] hover:bg-[#dce4e9]'>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.productId}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.productRefId}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.purchaseGroupId}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.productName}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.genericName}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.unitsPerPack}
                  </td>
                  <td className='border border-[#bfb6b6] p-2 text-center text-sm'>
                    {entry.wholesalePrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className='flex justify-end p-2 m-2 gap-4'>
        <button
          onClick={generatePDF}
          className='px-5 py-2 bg-[#1a5353] text-white rounded-md hover:bg-[#0d3b3b] transition-colors'
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PriceListTable;
