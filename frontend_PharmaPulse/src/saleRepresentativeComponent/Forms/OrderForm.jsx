import  { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";

const OrderForm = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [orderQty, setOrderQty] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const products = [
        {
            name: "Product A",
            code: "A001",
            price: 100,
            quantity: 50,
            expiryDate: "2025-12-31",
            manufacturer: "Manufacturer A",
        },
        {
            name: "Product B",
            code: "B001",
            price: 200,
            quantity: 20,
            expiryDate: "2026-06-30",
            manufacturer: "Manufacturer B",
        },
    ];

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToOrder = (product) => {
        const qty = parseInt(orderQty[product.code] || 0);
        if (qty > 0 && qty <= product.quantity) {
            setOrderItems((prevItems) => [
                ...prevItems,
                { ...product, orderQty: qty },
            ]);
            setOrderQty((prevQty) => ({ ...prevQty, [product.code]: "" }));
        } else {
            alert("Invalid quantity");
        }
    };

    const removeFromOrder = (productCode) => {
        setOrderItems(orderItems.filter((item) => item.code !== productCode));
    };

    const handleSubmit = () => {
        if (!customerName) {
            alert("Please enter a customer name");
            return;
        }

        console.log("Order submitted:", {
            customerName,
            orderItems,
        });
        setOrderItems([]);
        setCustomerName("");
    };

    return (
        <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
            {/* Price List Section */}
            <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Price List
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Search Product..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "#fff" }}>Product Name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Code</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Price</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Expiry Date</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Manufacturer</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Order Qty</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.code}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.code}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.expiryDate}</TableCell>
                                    <TableCell>{product.manufacturer}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={orderQty[product.code] || ""}
                                            onChange={(e) =>
                                                setOrderQty((prevQty) => ({
                                                    ...prevQty,
                                                    [product.code]: e.target.value,
                                                }))
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addToOrder(product)}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create Order Section */}
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Create Order
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.map((item) => (
                                <TableRow key={item.code}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.orderQty}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => removeFromOrder(item.code)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="success" onClick={handleSubmit}>
                        Submit Order
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOrderItems([]);
                            setCustomerName("");
                        }}
                    >
                        Cancel Order
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrderForm;
