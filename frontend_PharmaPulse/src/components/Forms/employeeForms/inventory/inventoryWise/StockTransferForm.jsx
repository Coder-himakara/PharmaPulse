/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllInventoryLocations } from '../../../../../api/StockTransferApiService';

const StockTransferForm = () => {
  // Replace hardcoded locations with state
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const products = [
    {
      id: 'PRD001',
      name: 'Product 1',
      batches: [
        { batchId: 'BATCH001', id: 1, itemName: 'Item A', unitPrice: 50.0, availableStock: 100, unit: 'pcs' },
        { batchId: 'BATCH002', id: 2, itemName: 'Item B', unitPrice: 60.0, availableStock: 50, unit: 'pcs' },
      ],
    },
    {
      id: 'PRD002',
      name: 'Product 2',
      batches: [
        { batchId: 'BATCH003', id: 3, itemName: 'Item C', unitPrice: 70.0, availableStock: 80, unit: 'pcs' },
        { batchId: 'BATCH004', id: 4, itemName: 'Item D', unitPrice: 80.0, availableStock: 30, unit: 'pcs' },
      ],
    },
  ];

  // Generate a unique reference ID (like "ST-123")
  function generateReferenceId() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `ST-${randomNum}`;
  }

  // Initialize form with current timestamp
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    timestamp: new Date().toISOString().split('T')[0],
    productName: '',
    productType: '',
    referenceId: generateReferenceId(),
  });

  const [batchRows, setBatchRows] = useState([]);
  const [proceedItems, setProceedItems] = useState([]);

  // Fetch inventory locations from API
  // Fetch inventory locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await getAllInventoryLocations();

        // Check for the correct response structure
        if (response && response.data && response.data.data) {
          // Response follows { code, message, data: [...locations] } structure
          const locationData = response.data.data.map(location => ({
            id: location.locationId,
            name: location.locationName,
            type: location.locationType,
            capacity: {
              total: location.totalCapacity,
              available: location.availableCapacity
            }
          }));
          setLocations(locationData);
        } else {
          console.error('Invalid location data format:', response);
          setLocations([]);
          toast.error('Failed to load inventory locations', {
            toastId: 'location-error'
          });
        }
      } catch (error) {
        console.error('Error fetching inventory locations:', error);
        setLocations([]);
        toast.error('Failed to load inventory locations', {
          toastId: 'location-error'
        });
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If user tries to select a disabled option (same as other dropdown), ignore the change
    if ((name === 'fromLocation' && value === formData.toLocation) || 
        (name === 'toLocation' && value === formData.fromLocation)) {
      // Don't update state - this prevents selection of disabled options
      return;
    }
    
    // Normal case - update the field
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBatchChange = (index, field, value) => {
    const newRows = [...batchRows];

    if (field === 'quantityPerTransfer') {
      const numericValue = value === '' ? 0 : parseInt(value, 10);
      let finalValue = isNaN(numericValue) ? 0 : numericValue;

      const availableStock = Number(newRows[index].availableStock) || 0;
      if (finalValue > availableStock) {
        finalValue = availableStock;
        toast.warning('Quantity cannot exceed available stock!', {
          toastId: "quantity-warning"
        });
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
    if (formData.productName && formData.fromLocation && formData.toLocation) {
      const selectedProduct = products.find((p) => p.name === formData.productName);
      if (selectedProduct) {
        const updatedBatches = selectedProduct.batches.map((batch) => ({
          batchId: batch.batchId,
          id: batch.id, // Keep track of the numeric batch ID
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
  }, [formData.productName, formData.fromLocation, formData.toLocation]);

  const addToProceed = (index) => {
    const rowToAdd = batchRows[index];

    if (rowToAdd.quantityPerTransfer <= 0) {
      toast.error('Please enter a quantity greater than 0 before adding to transfer.', {
        toastId: "quantity-error"
      });
      return;
    }

    // Create an item with all required data for the transfer API
    const itemToAdd = {
      ...rowToAdd,
      sourceLocation: formData.fromLocation,
      targetLocation: formData.toLocation
    };

    // Add to proceedItems array
    setProceedItems((prev) => [...prev, itemToAdd]);

    // Reset the row for potential additional transfers from same batch
    const newRows = [...batchRows];
    newRows[index] = {
      ...newRows[index],
      quantityPerTransfer: 0,
      balanceStock: newRows[index].availableStock,
      remarks: ''
    };
    setBatchRows(newRows);

    toast.success(`${itemToAdd.itemName} added to transfer list`, {
      toastId: "item-added"
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...proceedItems];
    newItems.splice(index, 1);
    setProceedItems(newItems);
    toast.info('Item removed from transfer list', {
      toastId: "item-removed"
    });
  };

  const handleProceed = () => {
    if (proceedItems.length === 0) {
      toast.error('No items added to transfer.', {
        toastId: "no-items-error"
      });
      return;
    }

    // Format data according to the required backend JSON structure
    const transferData = {
      referenceId: formData.referenceId,
      timestamp: new Date().toISOString(),
      lineList: proceedItems.map(item => ({
        batch: item.id, // Use the numeric batch ID
        quantity: item.quantityPerTransfer,
        sourceLocation: getLocationName(item.sourceLocation),
        targetLocation: getLocationName(item.targetLocation)
      }))
    };

    console.log('Transfer data:', transferData);
    toast.success('Stock transfer processed successfully!', {
      toastId: "transfer-success"
    });

    // Reset form after successful submission
    setProceedItems([]);
    setFormData({
      fromLocation: '',
      toLocation: '',
      timestamp: new Date().toISOString().split('T')[0],
      productName: '',
      productType: '',
      referenceId: generateReferenceId(),
    });
    setBatchRows([]);
  };

  // Helper function to get the location name from ID
  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
  };

  return (
    <div className='container p-6 mx-auto bg-gray-100 rounded-lg'>
      <form className='p-5 bg-white rounded-lg shadow-md' onSubmit={(e) => e.preventDefault()}>
        <h2 className='text-center bg-[#1a5353] text-white p-3 rounded-t-md -mx-5 mt-[-32px] mb-5 text-lg'>
          Stock Transfer
        </h2>

        <div className='grid grid-cols-3 gap-2 mb-4'>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>Date</label>
            <input
              type='date'
              name='timestamp'
              value={formData.timestamp}
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
              required
              disabled={isLoadingLocations}
            >
              <option value=''>Select Source Location</option>
              {locations.map((location) => (
                <option
                  key={location.id}
                  value={location.id}
                  disabled={location.id === formData.toLocation}
                  className={location.id === formData.toLocation ? 'text-gray-400' : ''}
                >
                  {location.name}
                </option>
              ))}
            </select>
            {isLoadingLocations && <p className="text-xs text-gray-500 mt-1">Loading locations...</p>}
          </div>
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>To</label>
            <select
              name='toLocation'
              value={formData.toLocation}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
              required
              disabled={isLoadingLocations}
            >
              <option value=''>Select Target Location</option>
              {locations.map((location) => (
                <option
                  key={location.id}
                  value={location.id}
                  disabled={location.id === formData.fromLocation}
                  className={location.id === formData.fromLocation ? 'text-gray-400' : ''}
                >
                  {location.name}
                </option>
              ))}
            </select>
            {isLoadingLocations && <p className="text-xs text-gray-500 mt-1">Loading locations...</p>}
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
              required
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
              name='referenceId'
              value={formData.referenceId}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
              placeholder='Enter reference (e.g., ST-123)'
            />
          </div>
        </div>

        {/* Batch Selection Table */}
        <div className='mb-4 overflow-x-auto'>
          <h3 className="mb-2 text-sm font-semibold">Available Batches</h3>
          <table className='min-w-full bg-gray-200'>
            <thead>
              <tr className='bg-gray-300'>
                <th className='px-4 py-2'>Batch ID</th>
                <th className='px-4 py-2'>Item Name</th>
                <th className='px-4 py-2'>Unit Price</th>
                <th className='px-4 py-2'>Available Stock</th>
                <th className='px-4 py-2'>Transfer Quantity</th>
                <th className='px-4 py-2'>Balance After Transfer</th>
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
                      value={row.quantityPerTransfer || ''}
                      onChange={(e) => handleBatchChange(index, 'quantityPerTransfer', e.target.value)}
                      className='w-full p-1 border rounded'
                      min='0'
                      max={row.availableStock}
                    />
                  </td>
                  <td className='px-4 py-2'>
                    {Number(row.availableStock) - Number(row.quantityPerTransfer || 0)}
                  </td>
                  <td className='px-4 py-2'>
                    <input
                      type='text'
                      value={row.remarks || ''}
                      onChange={(e) => handleBatchChange(index, 'remarks', e.target.value)}
                      className='w-full p-1 border rounded'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <button
                      type='button'
                      onClick={() => addToProceed(index)}
                      className='px-2 py-1 font-medium text-green-600 bg-green-100 rounded hover:bg-green-200'
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
              {batchRows.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                    Select a product and locations to view available batches
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Items to Transfer Summary */}
        {proceedItems.length > 0 && (
          <div className='mb-4'>
            <h3 className="mb-2 text-sm font-semibold">Items to Transfer</h3>
            <table className='min-w-full bg-blue-50'>
              <thead>
                <tr className='bg-blue-100'>
                  <th className='px-4 py-2'>Batch ID</th>
                  <th className='px-4 py-2'>Item Name</th>
                  <th className='px-4 py-2'>From</th>
                  <th className='px-4 py-2'>To</th>
                  <th className='px-4 py-2'>Quantity</th>
                  <th className='px-4 py-2'>Remarks</th>
                  <th className='px-4 py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {proceedItems.map((item, index) => (
                  <tr key={`${item.batchId}-${index}`} className='bg-white'>
                    <td className='px-4 py-2'>{item.batchId}</td>
                    <td className='px-4 py-2'>{item.itemName}</td>
                    <td className='px-4 py-2'>{getLocationName(item.sourceLocation)}</td>
                    <td className='px-4 py-2'>{getLocationName(item.targetLocation)}</td>
                    <td className='px-4 py-2'>{item.quantityPerTransfer}</td>
                    <td className='px-4 py-2'>{item.remarks || '-'}</td>
                    <td className='px-4 py-2'>
                      <button
                        type='button'
                        onClick={() => handleRemoveItem(index)}
                        className='px-2 py-1 font-medium text-red-600 bg-red-100 rounded hover:bg-red-200'
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='flex justify-end gap-2 mt-4'>
          <button
            type='button'
            onClick={handleProceed}
            disabled={proceedItems.length === 0}
            className={`px-5 py-2 text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${proceedItems.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#2a4d69] hover:bg-[#00796b]'
              }`}
          >
            Process Transfer {proceedItems.length > 0 && `(${proceedItems.length} ${proceedItems.length === 1 ? 'item' : 'items'})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransferForm;