/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

const StockTransferForm = () => {
  const locations = [
    { id: 'main-stock', name: 'Main Stock' },
    { id: 'truck-1', name: 'Truck 1' },
    { id: 'truck-2', name: 'Truck 2' },
    { id: 'truck-3', name: 'Truck 3' },
  ];

  const products = [
    {
      id: 'PRD001',
      name: 'Product 1',
      batches: [
        { batchId: 'BATCH001', itemName: 'Item A', unitPrice: 50.0, availableStock: 100, unit: 'pcs' },
        { batchId: 'BATCH002', itemName: 'Item B', unitPrice: 60.0, availableStock: 50, unit: 'pcs' },
      ],
    },
    {
      id: 'PRD002',
      name: 'Product 2',
      batches: [
        { batchId: 'BATCH003', itemName: 'Item C', unitPrice: 70.0, availableStock: 80, unit: 'pcs' },
        { batchId: 'BATCH004', itemName: 'Item D', unitPrice: 80.0, availableStock: 30, unit: 'pcs' },
      ],
    },
  ];

  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    date: '',
    productName: '',
    productType: '',
    reference: '',
  });

  const [batchRows, setBatchRows] = useState([]);
  const [proceedItems, setProceedItems] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBatchChange = (index, field, value) => {
    const newRows = [...batchRows];

    if (field === 'quantityPerTransfer') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      let finalValue = numericValue === '' ? 0 : Number(numericValue);

      const availableStock = Number(newRows[index].availableStock) || 0;
      if (finalValue > availableStock) {
        finalValue = availableStock;
        alert('Quantity cannot exceed available stock!');
      }

      newRows[index] = {
        ...newRows[index],
        quantityPerTransfer: finalValue,
        balanceStock: availableStock - finalValue,
      };
    } else {
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
    }

    setBatchRows(newRows);
  };

  useEffect(() => {
    if (formData.productName && formData.productType && formData.fromLocation && formData.toLocation) {
      const selectedProduct = products.find((p) => p.name === formData.productName);
      if (selectedProduct) {
        const updatedBatches = selectedProduct.batches.map((batch) => ({
          batchId: batch.batchId,
          itemName: batch.itemName,
          unitPrice: batch.unitPrice,
          availableStock: Number(batch.availableStock) || 0,
          quantityPerTransfer: 0, 
          balanceStock: Number(batch.availableStock) || 0,
          remarks: '',
          unit: batch.unit,
        }));
        setBatchRows(updatedBatches);
      } else {
        setBatchRows([]);
      }
    } else {
      setBatchRows([]);
    }
  }, [formData.productName, formData.productType, formData.fromLocation, formData.toLocation]);

  const addToProceed = (index) => {
    const rowToAdd = batchRows[index];
    if (rowToAdd.quantityPerTransfer > 0) {
      setProceedItems((prev) => [...prev, rowToAdd]);
      const newRows = [...batchRows];
      newRows[index] = {
        ...newRows[index],
        quantityPerTransfer: 0,
        balanceStock: newRows[index].availableStock,
        remarks: '',
      };
      setBatchRows(newRows);
      alert('Item added to proceed successfully!');
    } else {
      alert('Please enter a quantity greater than 0 before adding to proceed.');
    }
  };

  const handleProceed = () => {
    const batchIds = proceedItems.map((item) => item.batchId).join(', ');
    console.log('Proceeding with batch IDs:', batchIds);
    alert(`Proceeding with the following batch IDs: ${batchIds}`);
    setProceedItems([]);
  };

  return (
    <div className='container p-6 mx-auto bg-gray-100 rounded-lg'>
      <form className='p-5 bg-white rounded-lg shadow-md'>
        <h2 className='text-center bg-[#1a5353] text-white p-3 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
          Stock Transfer
        </h2>

        <div className='grid grid-cols-3 gap-2 mb-4'>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>Date</label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>From</label>
            <select
              name='fromLocation'
              value={formData.fromLocation}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>To</label>
            <select
              name='toLocation'
              value={formData.toLocation}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>Product Name</label>
            <select
              name='productName'
              value={formData.productName}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>Product Type</label>
            <select
              name='productType'
              value={formData.productType}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Product Type</option>
              <option value='Medicine'>Medicine</option>
              <option value='Surgical'>Surgical</option>
            </select>
          </div>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>Reference</label>
            <input
              type='text'
              name='reference'
              value={formData.reference}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
              placeholder='Enter reference (e.g., REF123)'
            />
          </div>
        </div>

        <div className='mb-4 overflow-x-auto'>
          <table className='min-w-full bg-gray-200'>
            <thead>
              <tr className='bg-gray-300'>
                <th className='px-4 py-2'>Batch Id</th>
                <th className='px-4 py-2'>Item Name</th>
                <th className='px-4 py-2'>Unit Price</th>
                <th className='px-4 py-2'>Available Stock</th>
                <th className='px-4 py-2'>Quantity Per Transfer</th>
                <th className='px-4 py-2'>Balance Stock</th>
                <th className='px-4 py-2'>Remarks</th>
                <th className='px-4 py-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {batchRows.map((row, index) => (
                <tr key={row.batchId} className='bg-white'>
                  <td className='px-4 py-2'>{row.batchId}</td>
                  <td className='px-4 py-2'>{row.itemName}</td>
                  <td className='px-4 py-2'>{row.unitPrice.toFixed(2)}</td>
                  <td className='px-4 py-2'>{row.availableStock}</td>
                  <td className='px-4 py-2'>
                    <input
                      type='number'
                      value={row.quantityPerTransfer ?? ''} 
                      onChange={(e) => handleBatchChange(index, 'quantityPerTransfer', e.target.value)}
                      className='w-full p-1 border rounded'
                      min='0'
                      max={row.availableStock}
                      step='1'
                      pattern="[0-9]*"
                    />
                  </td>
                  <td className='px-4 py-2'>
                    {Number(row.availableStock) - Number(row.quantityPerTransfer || 0)}
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      type='text'
                      className='w-full p-1 border rounded'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <button
                      type='button'
                      onClick={() => addToProceed(index)}
                      className='text-green-500 hover:text-green-700'
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          <button
            type='button'
            onClick={handleProceed}
            className='px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]'
          >
            Proceed
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransferForm;