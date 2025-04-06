/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllInventoryLocations, getInventoryDetails, submitStockTransfer } from '../../../../../api/InventoryApiService';
import { getAllProducts } from '../../../../../api/EmployeeApiService';

const StockTransferForm = () => {

  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingInventories, setIsLoadingInventories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFormVisible] = useState(true);


  // Initialize form with current timestamp
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    timestamp: new Date().toISOString().split('T')[0],
    productId: '',
    productName: '',
    productSearch: '',
    referenceId: generateReferenceId(),
  });

  const [batchRows, setBatchRows] = useState([]);
  const [proceedItems, setProceedItems] = useState([]);

  // Generate a unique reference ID (like "ST-123")
  function generateReferenceId() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `ST-${randomNum.toString().padStart(3, '0')}`;
  }

  // Format date array to string (YYYY-MM-DD)
  const formatExpiryDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Helper function to get the location name from ID - memoized for performance
  const getLocationName = useCallback((locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
  }, [locations]);

  // Helper function to get the product name from ID - memoized for performance
  const getProductName = useCallback((productId) => {
    if (!productId) return "";
    const product = products.find(p => p.id.toString() === productId.toString());
    return product ? product.name : "";
  }, [products]);

  // Helper function to get inventory statistics - memoized for performance
  const getInventoryStats = useCallback(() => {
    if (!inventoryDetails || inventoryDetails.length === 0) return null;

    return {
      totalItems: inventoryDetails.length,
      totalValue: inventoryDetails.reduce((sum, item) =>
        sum + ((item.wholesalePrice || 0) * (item.quantity || 0)), 0)
    };
  }, [inventoryDetails]);

  // Fetch inventory locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await getAllInventoryLocations();

        if (response?.data?.data) {
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

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await getAllProducts();

        if (response?.data?.data) {
          const productData = response.data.data.map(product => ({
            id: product.productId,
            name: product.productName || product.name || "Unknown Product"
          }));
          setProducts(productData);
          setFilteredProducts(productData);
        } else {
          console.error('Invalid product data format:', response);
          setProducts([]);
          toast.error('Failed to load products', {
            toastId: 'product-error'
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        toast.error('Failed to load products', {
          toastId: 'product-error'
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search input
  useEffect(() => {
    if (formData.productSearch) {
      const searchTerm = formData.productSearch.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [formData.productSearch, products]);

  // Fetch inventory details when location changes, product selection is optional
  useEffect(() => {
    const fetchInventoryDetails = async () => {
      // Only fetch if location is selected
      if (!formData.fromLocation) {
        setBatchRows([]);
        return;
      }

      setIsLoadingInventories(true);
      try {
        const response = await getInventoryDetails();

        if (response?.data?.data) {
          // Filter inventory details by location ID
          let filteredInventories = response.data.data.filter(inventory =>
            inventory.locationId.toString() === formData.fromLocation.toString()
          );

          // Further filter by product ID if one is selected
          if (formData.productId) {
            filteredInventories = filteredInventories.filter(inventory =>
              inventory.productId.toString() === formData.productId.toString()
            );
          }

          setInventoryDetails(filteredInventories);
          console.log(`Loaded ${filteredInventories.length} inventory items`);

          // Transform inventory data to batch rows format
          if (filteredInventories.length > 0) {
            const batchData = filteredInventories.map(inventory => ({
              inventoryId: inventory.inventoryId,
              batchId: inventory.batchId,
              productId: inventory.productId,
              productName: getProductName(inventory.productId) || "Unknown Product",
              unitPrice: inventory.wholesalePrice || 0,
              availableStock: inventory.quantity || 0,
              quantityPerTransfer: 0,
              balanceStock: inventory.quantity || 0,
              expiryDate: formatExpiryDate(inventory.expiryDate),
              remarks: '',
              status: inventory.batchStatus || 'UNKNOWN'
            }));

            setBatchRows(batchData);
          } else {
            setBatchRows([]);
            if (formData.productId) {
              toast.info(`No inventory found for the selected product at this location`, {
                toastId: 'no-inventory-product'
              });
            } else {
              toast.info(`No inventory found at this location`, {
                toastId: 'no-inventory-location'
              });
            }
          }
        } else {
          console.error('Invalid inventory data format:', response);
          setInventoryDetails([]);
          setBatchRows([]);
          toast.error('Failed to load inventory details', {
            toastId: 'inventory-details-error'
          });
        }
      } catch (error) {
        console.error('Error fetching inventory details:', error);
        setInventoryDetails([]);
        setBatchRows([]);
        toast.error('Failed to load inventory details', {
          toastId: 'inventory-details-error'
        });
      } finally {
        setIsLoadingInventories(false);
      }
    };

    fetchInventoryDetails();
  }, [formData.fromLocation, formData.productId, getProductName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productSearch') {
      // Just update the search term, don't set it as the selected product yet
      setFormData(prev => ({
        ...prev,
        productSearch: value
      }));
    }
    // If user tries to select a disabled option (same as other dropdown), ignore the change
    else if ((name === 'fromLocation' && value === formData.toLocation) ||
      (name === 'toLocation' && value === formData.fromLocation)) {
      // Don't update state - this prevents selection of disabled options
      return;
    }
    else if (name === 'fromLocation') {
      // Reset product selection when changing location
      setFormData(prev => ({
        ...prev,
        [name]: value,
        productId: '',
        productName: '',
        productSearch: ''
      }));
    } else {
      // Normal case - update the field
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const selectProduct = (product) => {
    setFormData(prev => ({
      ...prev,
      productId: product.id,
      productName: product.name,
      productSearch: '' // Clear search after selection
    }));
  };

  const clearSelectedProduct = () => {
    setFormData(prev => ({
      ...prev,
      productId: '',
      productName: '',
      productSearch: ''
    }));
  };

  const addToProceed = (index) => {
    const rowToAdd = batchRows[index];

    if (rowToAdd.quantityPerTransfer <= 0) {
      toast.error('Please enter a quantity greater than 0 before adding to transfer.', {
        toastId: "quantity-error"
      });
      return;
    }

    if (!formData.toLocation) {
      toast.error('Please select a target location before adding items.', {
        toastId: "location-error"
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
    setProceedItems(prev => [...prev, itemToAdd]);

    // Update all batch rows, reducing the available stock for the transferred item
    const newRows = [...batchRows];

    // Update the selected row and reset input fields
    const transferredQuantity = newRows[index].quantityPerTransfer;
    newRows[index] = {
      ...newRows[index],
      availableStock: newRows[index].availableStock - transferredQuantity,  // Reduce available stock
      quantityPerTransfer: 0, // Reset input field
      balanceStock: newRows[index].availableStock - transferredQuantity,  // Update balance
      remarks: ''
    };

    setBatchRows(newRows);

    toast.success(`Item added to transfer list`, {
      toastId: "item-added"
    });
  };

  const handleRemoveItem = (index) => {
    // Get the removed item
    const removedItem = proceedItems[index];

    // Return the quantity to the batch's available stock
    const batchIndex = batchRows.findIndex(row => row.batchId === removedItem.batchId);

    if (batchIndex !== -1) {
      // Update the batch's available stock
      setBatchRows(prev => {
        const updated = [...prev];
        updated[batchIndex] = {
          ...updated[batchIndex],
          availableStock: updated[batchIndex].availableStock + removedItem.quantityPerTransfer,
          balanceStock: updated[batchIndex].availableStock + removedItem.quantityPerTransfer
        };
        return updated;
      });
    }

    // Remove the item from proceedItems
    setProceedItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });

    toast.info('Item removed from transfer list', {
      toastId: "item-removed"
    });
  };

  const resetForm = () => {
    // Clear all dynamic states
    setProceedItems([]);
    setBatchRows([]);
    setInventoryDetails([]);

    // Reset formData to initial values
    setFormData({
      fromLocation: '',
      toLocation: '',
      timestamp: new Date().toISOString().split('T')[0],
      productId: '',
      productName: '',
      productSearch: '',
      referenceId: generateReferenceId(), // Generates new ID
    });

    // Optionally re-fetch locations/products if needed (see below)
  };

  const handleProceed = async () => {
    if (proceedItems.length === 0) {
      toast.error('No items added to transfer.', { toastId: "no-items-error" });
      return;
    }
    setIsSubmitting(true);

    try {
      const sourceLocationObj = locations.find(loc => loc.id.toString() === formData.fromLocation.toString());
      const targetLocationObj = locations.find(loc => loc.id.toString() === formData.toLocation.toString());

      if (!sourceLocationObj || !targetLocationObj) {
        toast.error('Invalid location selections', { toastId: "invalid-location-error" });
        setIsSubmitting(false);
        return;
      }

      const transferData = {
        referenceId: formData.referenceId,
        timestamp: new Date().toISOString(),
        lineList: proceedItems.map(item => ({
          batch: parseInt(item.batchId, 10) || item.batchId,
          quantity: item.quantityPerTransfer,
          sourceLocation: sourceLocationObj.name,
          targetLocation: targetLocationObj.name
        }))
      };

      console.log('Transfer data to be sent:', transferData);
      const response = await submitStockTransfer(transferData);

      if (response?.data?.code === 200 || response?.data?.success === true) {
        toast.success('Stock transfer processed successfully!', {
          toastId: "transfer-success",
          autoClose: 1500,
          onClose: () => {
            resetForm(); // This will remount the component
          }
        });
      } else {
        const errorMessage = response?.data?.message || 'Failed to process stock transfer. Please try again.';
        toast.error(errorMessage, { toastId: "transfer-error" });
      }
    } catch (error) {
      console.error('Error submitting stock transfer:', error);
      let errorMessage = 'Unknown error occurred';
      if (error.response?.data?.data) {
        errorMessage = error.response.data.data;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(`Failed to process stock transfer: ${errorMessage}`, { toastId: "transfer-error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container p-6 mx-auto bg-gray-100 rounded-lg'>
      {isFormVisible ? (
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

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className="relative">
              <label className='block mb-1 text-sm font-medium text-gray-700'>
                Product (Optional - For Filtering)
              </label>
              <input
                type='text'
                name='productSearch'
                value={formData.productSearch}
                onChange={handleInputChange}
                className='w-full p-2 border rounded'
                placeholder='Search for product to filter...'
                autoComplete="off"
                disabled={!formData.fromLocation || isLoadingProducts}
              />
              {formData.productSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {product.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No products found</div>
                  )}
                </div>
              )}
              {formData.productName && (
                <div className="mt-2 p-1 bg-blue-50 border border-blue-100 rounded flex justify-between items-center">
                  <span className="text-sm">{formData.productName}</span>
                  <button
                    type="button"
                    onClick={clearSelectedProduct}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
              {(isLoadingProducts && !formData.productName) && <p className="text-xs text-gray-500 mt-1">Loading products...</p>}
              {!formData.fromLocation && <p className="text-xs text-gray-500 mt-1">Select a source location first</p>}
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
            <h3 className="mb-2 text-sm font-semibold">
              {formData.fromLocation
                ? `Available Batches at ${getLocationName(formData.fromLocation)}${formData.productName ? ` filtered by ${formData.productName}` : ''}`
                : 'Available Batches'}
            </h3>
            {formData.fromLocation && inventoryDetails.length > 0 && (
              <div className="text-xs text-gray-600 mb-2">
                {getInventoryStats()?.totalItems || 0} items |
                Total Value: Rs.{getInventoryStats()?.totalValue?.toFixed(2) || '0.00'}
              </div>
            )}
            <table className='min-w-full bg-gray-200'>
              <thead>
                <tr className='bg-gray-300'>
                  <th className='px-4 py-2'>Batch ID</th>
                  <th className='px-4 py-2'>Product</th>
                  <th className='px-4 py-2'>Expiry Date</th>
                  <th className='px-4 py-2'>Unit Price</th>
                  <th className='px-4 py-2'>Available Stock</th>
                  <th className='px-4 py-2'>Transfer Quantity</th>
                  <th className='px-4 py-2'>Balance After Transfer</th>
                  <th className='px-4 py-2'>Status</th>
                  <th className='px-4 py-2'>Remarks</th>
                  <th className='px-4 py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingInventories ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-3 text-center text-gray-500">
                      Loading inventory details...
                    </td>
                  </tr>
                ) : (
                  <>
                    {batchRows.map((row, index) => (
                      <tr key={row.inventoryId} className='bg-white'>
                        <td className='px-4 py-2'>{row.batchId}</td>
                        <td className='px-4 py-2'>{row.productName}</td>
                        <td className='px-4 py-2'>{row.expiryDate}</td>
                        <td className='px-4 py-2'>{typeof row.unitPrice === 'number' ? row.unitPrice.toFixed(2) : '0.00'}</td>
                        <td className='px-4 py-2'>{row.availableStock}</td>
                        <td className='px-4 py-2'>
                          <input
                            type='number'
                            value={row.quantityPerTransfer || ''}
                            onChange={(e) => handleBatchChange(index, 'quantityPerTransfer', e.target.value)}
                            className='w-full p-1 border rounded'
                            min='0'
                            max={row.availableStock}
                            disabled={row.status !== 'AVAILABLE'}
                          />
                        </td>
                        <td className='px-4 py-2'>
                          {Number(row.availableStock) - Number(row.quantityPerTransfer || 0)}
                        </td>
                        <td className='px-4 py-2'>
                          <span className={`px-2 py-1 text-xs rounded-full ${row.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {row.status}
                          </span>
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
                            className={`px-2 py-1 font-medium rounded 
                          ${!formData.toLocation || row.quantityPerTransfer <= 0 || row.status !== 'AVAILABLE'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-green-600 bg-green-100 hover:bg-green-200'}`}
                            disabled={!formData.toLocation || row.quantityPerTransfer <= 0 || row.status !== 'AVAILABLE'}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                    {batchRows.length === 0 && !isLoadingInventories && (
                      <tr>
                        <td colSpan="10" className="px-4 py-3 text-center text-gray-500">
                          {!formData.fromLocation ? (
                            "Select a source location to view available batches"
                          ) : (
                            `No batches found${formData.productName ? ` for ${formData.productName}` : ''} at ${getLocationName(formData.fromLocation)}`
                          )}
                        </td>
                      </tr>
                    )}
                  </>
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
                    <th className='px-4 py-2'>Product</th>
                    <th className='px-4 py-2'>Expiry Date</th>
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
                      <td className='px-4 py-2'>{item.productName}</td>
                      <td className='px-4 py-2'>{item.expiryDate}</td>
                      <td className='px-4 py-2'>{getLocationName(item.sourceLocation)}</td>
                      <td className='px-4 py-2'>{getLocationName(item.targetLocation)}</td>
                      <td className='px-4 py-2'>{item.quantityPerTransfer}</td>
                      <td className='px-4 py-2'>{item.remarks || '-'}</td>
                      <td className='px-4 py-2'>
                        <button
                          type='button'
                          onClick={() => handleRemoveItem(index)}
                          className='px-2 py-1 font-medium text-red-600 bg-red-100 rounded hover:bg-red-200'
                          disabled={isSubmitting}
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
              disabled={proceedItems.length === 0 || isSubmitting}
              className={`px-5 py-2 text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 ${proceedItems.length === 0 || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2a4d69] hover:bg-[#00796b]'
                }`}
            >
              {isSubmitting ? 'Processing...' : `Process Transfer ${proceedItems.length > 0 ? `(${proceedItems.length} ${proceedItems.length === 1 ? 'item' : 'items'})` : ''}`}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-5 text-center">
          <span className="text-gray-500">Resetting form...</span>
        </div>
      )}
    </div>
  );
};

export default StockTransferForm;