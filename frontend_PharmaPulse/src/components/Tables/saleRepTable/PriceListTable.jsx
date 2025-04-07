import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/ApiClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PriceListTable = () => {
  const [priceList, setPriceList] = useState([]);
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [filteredPriceList, setFilteredPriceList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const pdfRef = useRef();

  // 1) Fetch purchase groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const resp = await apiClient.get('/purchase-groups/all');
        // StandardResponse.data is the array
        setPurchaseGroups(resp.data.data);
      } catch (err) {
        console.error('Error fetching purchase groups:', err);
      }
    };
    fetchGroups();
  }, []);

  // 2) Fetch price list
  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const resp = await apiClient.get('/price-list');
        setPriceList(resp.data);
        setFilteredPriceList(resp.data);
      } catch (err) {
        console.error('Error fetching price list:', err);
        setError('Failed to load price list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPriceList();
  }, []);

  // 3) Filter by productName
  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredPriceList(
      priceList.filter((e) =>
        String(e.productName).toLowerCase().startsWith(term),
      ),
    );
  }, [search, priceList]);

  // 4) Build a lookup map: id → name
  const groupNameById = purchaseGroups.reduce(
    (acc, g) => ({ ...acc, [g.purchaseGroupId]: g.purchaseGroupName }),
    {},
  );

  const handleClose = () => navigate('/dashboard');

  const generatePDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = 297;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`price-list_${Date.now()}.pdf`);
  };

  if (loading) return <p className='text-center p-4'>Loading price list...</p>;
  if (error) return <p className='text-red-500 text-center p-4'>{error}</p>;

  return (
    <div className='bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative'>
      {/* Header */}
      <div className='bg-[#1a5353] text-white px-4 py-3 rounded-t-lg relative'>
        <h1 className='text-2xl'>Price List Management</h1>
        <button
          onClick={handleClose}
          className='absolute top-3 right-4 text-2xl hover:text-[#f1f1f1]'
        >
          ×
        </button>
      </div>

      {/* Toolbar */}
      <div className='flex items-center justify-between p-4'>
        <h2 className='text-2xl font-bold text-[#1a5353]'>Price List</h2>
        <input
          type='text'
          placeholder='Search by Product Name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-[#ccc] rounded-md text-sm w-[300px]'
        />
      </div>

      {/* Table */}
      <div ref={pdfRef} className='p-4'>
        {filteredPriceList.length === 0 ? (
          <p className='text-center text-[#991919] font-bold'>
            {search
              ? 'No entries match your search.'
              : 'No price list entries available.'}
          </p>
        ) : (
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Product Ref ID
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Purchase Group Name
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Product Name
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Generic Name
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Units per Pack
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Wholesale Price (Rs)
                </th>
                <th className='border p-2 bg-[#ffb24d] text-[#5e5757] text-sm'>
                  Expiry Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPriceList.map((entry, idx) => (
                <tr
                  key={idx}
                  className='bg-[#c6dceb] hover:bg-[#dce4e9] text-center text-sm'
                >
                  <td className='border p-2'>{entry.productRefId}</td>
                  <td className='border p-2'>
                    {groupNameById[entry.purchaseGroupId] || '—'}
                  </td>
                  <td className='border p-2'>{entry.productName}</td>
                  <td className='border p-2'>{entry.genericName}</td>
                  <td className='border p-2'>{entry.unitsPerPack}</td>
                  <td className='border p-2'>
                    {Number(entry.wholesalePrice).toFixed(2)}
                  </td>
                  <td className='border p-2'>
                    {new Date(entry.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Actions */}
      <div className='flex justify-end p-4'>
        <button
          onClick={generatePDF}
          className='px-5 py-2 bg-[#1a5353] text-white rounded-md hover:bg-[#0d3b3b]'
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PriceListTable;
