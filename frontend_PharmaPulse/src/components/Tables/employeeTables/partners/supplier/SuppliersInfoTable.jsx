/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SuppliersInfoTable = ({ refreshTrigger }) => {
  const [search, setSearch] = useState("");
  const [sortDirection] = useState("asc");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        console.log("Fetching suppliers...");
        const response = await axios.get("http://localhost:8090/api/suppliers/all", {
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: "admin", // Adjust credentials as needed
            password: "admin123",
          },
        });
        console.log("Full API Response:", JSON.stringify(response.data, null, 2));
        const data = response.data.data || [];
        console.log("Suppliers Data:", JSON.stringify(data, null, 2));
        setSuppliers(data);
        setErrorMessage("");
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch suppliers"
        );
        console.error("Error:", error.response || error);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [refreshTrigger]);

  const filteredSuppliers = suppliers.filter((supplier) =>
    (supplier.supplier_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    // Sort by supplier_name since dateOfConnected isn’t in SupplierDTO
    const valueA = a.supplier_name || "";
    const valueB = b.supplier_name || "";
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const handleClose = () => {
    navigate("/employee-dashboard");
  };

  const handleEdit = (supplierId) => {
    const supplier = suppliers.find((s) => s.supplier_id === supplierId);
    console.log("Editing supplier:", JSON.stringify(supplier, null, 2));
    if (!supplier || supplier.supplier_id === undefined || supplier.supplier_id === null) {
      console.error("Missing supplier_id in:", supplier);
      setErrorMessage("Cannot edit: Supplier ID is missing or invalid.");
      return;
    }
    navigate(`/employee-dashboard/edit-supplier/${supplier.supplier_id}`, {
      state: { supplier },
    });
  };

  const handleViewSupplier = (supplier) => {
    console.log("Viewing supplier:", JSON.stringify(supplier, null, 2));
    if (!supplier || supplier.supplier_id === undefined || supplier.supplier_id === null) {
      console.error("Missing supplier_id in:", supplier);
      setErrorMessage("Cannot view: Supplier ID is missing or invalid.");
      return;
    }
    navigate(`/employee-dashboard/view-supplier/${supplier.supplier_id}`, {
      state: { supplier },
    });
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-800">Loading suppliers...</div>
    );
  }

  return (
    <div className="bg-[#e6eef3] rounded-lg shadow-lg mb-5 pb-5 h-full relative">
      <div className="bg-[#1a5353] text-white px-4 py-3 text-left rounded-t-lg m-0 relative">
        <h1 className="p-1 m-1 text-2xl">Suppliers Management</h1>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-none text-white border-none text-2xl cursor-pointer hover:text-[#f1f1f1] mr-4"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      {errorMessage && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-between p-2 m-2">
        <h2 className="text-2xl font-bold text-[#1a5353]">Suppliers</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-[#ccc] rounded-md text-sm w-[400px]"
          />
        </div>
      </div>

      {sortedSuppliers.length === 0 && (
        <div className="text-[#991919] text-sm text-center mt-2 font-bold">
          {search ? "No suppliers found matching your search." : "No suppliers available."}
        </div>
      )}

      {sortedSuppliers.length > 0 && (
        <div className="p-2 m-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Supplier Name
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Supplier Address
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Contact Number
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Purchase Group
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Credit Period (Months)
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Credit Limit (Rs.)
                </th>
                <th className="border border-[#bfb6b6] p-2 text-center bg-[#ffb24d] text-[#5e5757] text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSuppliers.map((supplier, index) => (
                <tr key={index} className="bg-[#c6dceb] hover:bg-[#dce4e9]">
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.supplier_name || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.supplier_address || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.supplier_contactNo || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.purchase_group || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.credit_period || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    {supplier.credit_limit || "N/A"}
                  </td>
                  <td className="border border-[#bfb6b6] p-2 text-center text-sm">
                    <button
                      className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                      onClick={() => handleEdit(supplier.supplier_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-[#4c85a6] text-white py-1 px-3 rounded-md cursor-pointer text-sm hover:bg-[#15375c] mr-2"
                      onClick={() => handleViewSupplier(supplier)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

SuppliersInfoTable.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default SuppliersInfoTable;