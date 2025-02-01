import { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

const PriceListTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState([
    { id: 1, name: "Product A", code: "P001", price: 50, quantity: 100, expiry: "2025-12-31", manufacturer: "Company X" },
    { id: 2, name: "Product B", code: "P002", price: 75, quantity: 200, expiry: "2026-06-15", manufacturer: "Company Y" },
    { id: 3, name: "Product C", code: "P003", price: 30, quantity: 150, expiry: "2025-08-22", manufacturer: "Company Z" },
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-white bg-teal-800 p-3 rounded-t-md">Price List Management</h1>
      <div className="p-3 bg-white rounded-b-md">
        <TextField
          label="Search by Name or Code"
          variant="outlined"
          fullWidth
          className="mb-4"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TableContainer component={Paper} className="shadow-lg rounded-lg overflow-hidden">
          <Table>
            <TableHead className="bg-orange-400 text-white">
              <TableRow>
                <TableCell className="font-bold text-white border-2 border-gray-300">Product Name</TableCell>
                <TableCell className="font-bold text-white border-2 border-gray-300">Code</TableCell>
                <TableCell className="font-bold text-white border-2 border-gray-300">Price (Rs)</TableCell>
                <TableCell className="font-bold text-white border-2 border-gray-300">Quantity</TableCell>
                <TableCell className="font-bold text-white border-2 border-gray-300">Expiry Date</TableCell>
                <TableCell className="font-bold text-white border-2 border-gray-300">Manufacturer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-blue-100">
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-blue-200 border-2 border-gray-300">
                  <TableCell className="border-2 border-gray-300">{product.name}</TableCell>
                  <TableCell className="border-2 border-gray-300">{product.code}</TableCell>
                  <TableCell className="border-2 border-gray-300">{product.price}</TableCell>
                  <TableCell className="border-2 border-gray-300">{product.quantity}</TableCell>
                  <TableCell className="border-2 border-gray-300">{product.expiry}</TableCell>
                  <TableCell className="border-2 border-gray-300">{product.manufacturer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PriceListTable;
