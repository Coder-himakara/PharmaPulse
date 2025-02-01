import { useState } from "react";
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
    MenuItem,
    Select,
    Grid,
} from "@mui/material";

const customers = [
    { regNo: "CUST001", name: "John Doe" },
    { regNo: "CUST002", name: "Jane Smith" },
];

const products = [
    { name: "Product A", code: "A001", price: 100, quantity: 50 },
    { name: "Product B", code: "B001", price: 200, quantity: 20 },
];

const OrderForm = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [customerRegNo, setCustomerRegNo] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [orderQty, setOrderQty] = useState("");
    const [quantityError, setQuantityError] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleCustomerChange = (regNo) => {
        setCustomerRegNo(regNo);
        const customer = customers.find((c) => c.regNo === regNo);
        setCustomerName(customer ? customer.name : "");
    };

    const addToOrder = () => {
        const product = products.find((p) => p.code === selectedProduct);
        const qty = parseInt(orderQty);

        if (!product || qty <= 0 || qty > product.quantity) {
            setQuantityError(true);
            return;
        }

        setOrderItems((prevItems) => [...prevItems, { ...product, orderQty: qty }]);
        setSelectedProduct("");
        setOrderQty("");
        setQuantityError(false);
    };

    const removeFromOrder = (productCode) => {
        setOrderItems(orderItems.filter((item) => item.code !== productCode));
    };

    const handleSubmit = () => {
        if (!customerRegNo) {
            alert("Please enter a customer registration number");
            return;
        }

        console.log("Order submitted:", {
            customerRegNo,
            customerName,
            orderItems,
        });
        setOrderItems([]);
        setCustomerRegNo("");
        setCustomerName("");
    };

    return (
        <Box p={4} bgcolor="#e0f2f1" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom color="#004d40">
                    Create Order
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Customer Registration No"
                            value={customerRegNo}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                        >
                            {customers.map((customer) => (
                                <MenuItem key={customer.regNo} value={customer.regNo}>
                                    {customer.regNo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            value={customerName}
                            variant="outlined"
                            disabled
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Search Product"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            fullWidth
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Product</MenuItem>
                            {products
                                .filter((product) =>
                                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((product) => (
                                    <MenuItem key={product.code} value={product.code}>
                                        {product.name} - ${product.price}
                                    </MenuItem>
                                ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="number"
                            fullWidth
                            label="Quantity"
                            value={orderQty}
                            onChange={(e) => setOrderQty(e.target.value)}
                            error={quantityError}
                            helperText={quantityError ? "Invalid quantity" : ""}
                        />
                    </Grid>
                </Grid>
                <Button sx={{ mt: 2, bgcolor: "#00796b" }} variant="contained" onClick={addToOrder}>
                    Add to Order
                </Button>
                <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#ffcc80" }}>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.map((item) => (
                                <TableRow key={item.code} sx={{ bgcolor: "#bbdefb" }}>
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
                            setCustomerRegNo("");
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
