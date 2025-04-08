/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllInventoryLocations, getInventoryDetails } from '../../../../../api/InventoryApiService';
import { getAllProducts } from '../../../../../api/EmployeeApiService';

const InventoryLocation = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [error, setError] = useState(null);

  // Format expiry date
  const formatExpiryDate = useCallback((dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }, []);

  // Helper function to get product name by ID - memoized for performance
  const getProductName = useCallback(
    (productId) => {
      if (!productId) return 'Unknown Product';
      return products[productId] || 'Loading...';
    },
    [products]
  );

  // Fetch all inventory locations
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await getAllInventoryLocations();
        console.log('Locations Response:', response);
        if (response?.data?.data) {
          const locationData = response.data.data.map((location) => ({
            id: location.locationId,
            name: location.locationName,
          }));
          setLocations(locationData);
          setError(null);
        } else {
          console.error('Invalid location data format:', response);
          setLocations([]);
          toast.error('Failed to load inventory locations', {
            toastId: 'location-error',
          });
        }
      } catch (err) {
        console.error('Error fetching locations:', err.response || err.message);
        setLocations([]);
        setError('Failed to load inventory locations');
        toast.error('Failed to load inventory locations', {
          toastId: 'location-error',
        });
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Fetch all products (for product names)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        console.log('Products Response:', response);
        if (response?.data?.data) {
          const productMap = response.data.data.reduce((acc, product) => {
            acc[product.productId] = product.productName || 'Unknown Product';
            return acc;
          }, {});
          setProducts(productMap);
        } else {
          console.error('Invalid product data format:', response);
          setProducts({});
          toast.error('Failed to load products', {
            toastId: 'product-error',
          });
        }
      } catch (err) {
        console.error('Error fetching products:', err.response || err.message);
        setProducts({});
        toast.error('Failed to load products', {
          toastId: 'product-error',
        });
      }
    };
    fetchProducts();
  }, []);

  // Fetch inventory details when a location is selected
  useEffect(() => {
    const fetchInventoryDetails = async () => {
      if (!selectedLocation) {
        setInventoryDetails([]);
        return;
      }
      setIsLoadingInventory(true);
      try {
        const response = await getInventoryDetails();
        console.log('Inventory Details Response:', response);
        if (response?.data?.data) {
          const filteredInventory = response.data.data.filter(
            (inventory) => String(inventory.locationId) === String(selectedLocation)
          );
          console.log('Filtered Inventory:', filteredInventory);
          setInventoryDetails(filteredInventory);
          setError(null);
          if (filteredInventory.length === 0) {
            toast.info(`No inventory found at this location`, {
              toastId: 'no-inventory-location',
            });
          }
        } else {
          console.error('Invalid inventory data format:', response);
          setInventoryDetails([]);
          setError('Failed to load inventory details');
          toast.error('Failed to load inventory details', {
            toastId: 'inventory-details-error',
          });
        }
      } catch (err) {
        console.error('Error fetching inventory details:', err.response || err.message);
        setInventoryDetails([]);
        setError('Failed to load inventory details');
        toast.error('Failed to load inventory details', {
          toastId: 'inventory-details-error',
        });
      } finally {
        setIsLoadingInventory(false);
      }
    };
    fetchInventoryDetails();
  }, [selectedLocation]);

  // Handle location selection
  const handleLocationChange = (e) => {
    console.log('Selected Location:', e.target.value);
    setSelectedLocation(e.target.value);
    setError(null);
  };

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg p-6 mx-auto max-w-4xl">
      {/* Header */}
      <div className="bg-[#1a5353] text-white px-4 py-3 rounded-t-lg mb-6">
        <h1 className="text-2xl font-semibold">Inventory Location Details</h1>
      </div>

      {/* Location Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-[#5e5757]">
          Select Inventory Location
        </label>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="w-full p-2 border border-[#bfb6b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5353]"
          disabled={isLoadingLocations}
        >
          <option value="">Select a Location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        {isLoadingLocations && (
          <p className="mt-1 text-xs text-gray-500">Loading locations...</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[#991919] text-sm font-bold mb-4 text-center">
          {error}
        </p>
      )}

      {/* Inventory Table */}
      {selectedLocation && (
        <div className="overflow-x-auto">
          {isLoadingInventory ? (
            <p className="text-center text-gray-500">Loading inventory details...</p>
          ) : inventoryDetails.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ffb24d] text-[#5e5757]">
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Batch ID</th>
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Product</th>
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Expiry Date</th>
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Unit Price</th>
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Quantity</th>
                  <th className="border border-[#bfb6b6] p-2 text-center text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryDetails.map((item, index) => (
                  <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">{item.batchId}</td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {getProductName(item.productId)}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {formatExpiryDate(item.expiryDate)}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {item.wholesalePrice ? `Rs.${item.wholesalePrice.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      {item.quantity || 'N/A'}
                    </td>
                    <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.batchStatus === 'AVAILABLE'
                            ? 'bg-green-100 text-green-800'
                            : item.batchStatus === 'NEAR_EXPIRY'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.batchStatus || 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              No inventory details found for this location.
            </p>
          )}
        </div>
      )}

      {!selectedLocation && !isLoadingLocations && (
        <p className="text-center text-gray-500">
          Please select a location to view inventory details.
        </p>
      )}
    </div>
  );
};

export default InventoryLocation;