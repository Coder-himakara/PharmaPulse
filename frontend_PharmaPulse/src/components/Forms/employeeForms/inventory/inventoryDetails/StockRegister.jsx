/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { getAllBatchInventories } from '../../../../../api/InventoryApiService'; // Adjust the import path based on your project structure

const StockRegister = () => {
  // Add a date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Check if dateString is an array (like [2023, 5, 15])
      if (Array.isArray(dateString)) {
        // Convert array to ISO date string: YYYY-MM-DD
        const [year, month, day] = dateString;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
      
      // If it's already a string, try to format it
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      // Return formatted date: YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Error";
    }
  };

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getAllBatchInventories(); // Call the API
        const batchData = response.data.data; // Assuming the data is nested under 'data' in StandardResponse
        setBatches(batchData.map(batch => ({
          batchId: batch.batchId,
          productName: batch.productName || (batch.productId ? `Product ${batch.productId}` : 'Unknown Product'),
          expiryDate: batch.expiryDate, // Keep original format for processing
          formattedExpiryDate: formatDate(batch.expiryDate), // Add formatted version
          availableUnitQuantity: batch.availableUnitQuantity,
          wholesalePrice: batch.wholesalePrice,
          batchStatus: batch.batchStatus,
        })));
        setError(null);
      } catch (err) {
        setError("Failed to load stock data from the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(batches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatches = batches.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="p-5 text-center text-[#1a5353] text-lg">Loading stock data...</div>;

  return (
    <div className="bg-[#e6eef3] min-h-screen p-6">
      <div className="bg-[#1a5353] text-white px-6 py-4 rounded-t-lg shadow-md mb-6">
        <h1 className="text-3xl font-semibold">Stock Register</h1>
      </div>

      {error && (
        <p className="text-[#991919] text-lg font-semibold mb-6 text-center">
          {error}
        </p>
      )}

      {batches.length === 0 && !error ? (
        <div className="text-[#991919] text-lg font-semibold text-center">
          No batches available at this time.
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ffb24d] text-[#5e5757]">
                  <th className="p-3 text-sm font-semibold text-left">Batch ID</th>
                  <th className="p-3 text-sm font-semibold text-left">Product Name (Generic)</th>
                  <th className="p-3 text-sm font-semibold text-left">Expiry Date</th>
                  <th className="p-3 text-sm font-semibold text-left">Available Quantity</th>
                  <th className="p-3 text-sm font-semibold text-left">Wholesale Price</th>
                  <th className="p-3 text-sm font-semibold text-left">Batch Status</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.map((batch) => (
                  <tr
                    key={batch.batchId}
                    className="bg-[#c6dceb] hover:bg-[#dce4e9] border-b border-[#bfb6b6]"
                  >
                    <td className="p-3 text-[#5e5757] text-sm">{batch.batchId}</td>
                    <td className="p-3 text-[#5e5757] text-sm">{batch.productName}</td>
                    <td className="p-3 text-[#5e5757] text-sm">{batch.formattedExpiryDate}</td>
                    <td className="p-3 text-[#5e5757] text-sm">{batch.availableUnitQuantity}</td>
                    <td className="p-3 text-[#5e5757] text-sm">
                     Rs.{Number(batch.wholesalePrice).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          batch.batchStatus === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : batch.batchStatus === "NEAR_EXPIRY"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {batch.batchStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-white ${
                currentPage === 1 ? "bg-[#4c85a6] opacity-50 cursor-not-allowed" : "bg-[#4c85a6] hover:bg-[#15375c]"
              }`}
            >
              Previous
            </button>
            <span className="text-[#5e5757] text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-white ${
                currentPage === totalPages ? "bg-[#4c85a6] opacity-50 cursor-not-allowed" : "bg-[#4c85a6] hover:bg-[#15375c]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockRegister;