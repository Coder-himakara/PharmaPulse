package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import com.group03.backend_PharmaPulse.order.api.OrderService;
import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import com.group03.backend_PharmaPulse.order.internal.mapper.OrderMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.OrderRepository;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.ProductWholesalePriceService;
import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.group03.backend_PharmaPulse.order.internal.entity.OrderItem;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final BatchInventoryService batchInventoryService;
    private final InventoryReservationService inventoryReservationService;
    private final CustomerService customerService;
    private final ProductService productService;
    private final ProductWholesalePriceService productWholesalePriceService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderMapper orderMapper,
                            BatchInventoryService batchInventoryService,
                            InventoryReservationService inventoryReservationService,
                            CustomerService customerService,
                            ProductService productService,
                            ProductWholesalePriceService productWholesalePriceService) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.batchInventoryService = batchInventoryService;
        this.inventoryReservationService = inventoryReservationService;
        this.customerService = customerService;
        this.productService = productService;
        this.productWholesalePriceService = productWholesalePriceService;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // --- Enrich Customer Information ---
        if (orderDTO.getCustomerId() == null) {
            throw new RuntimeException("Customer ID is required");
        }
        // Retrieve full customer details from CustomerService
        var fullCustomer = customerService.getCustomerById(orderDTO.getCustomerId());
        if (fullCustomer == null) {
            throw new RuntimeException("Customer not found for id: " + orderDTO.getCustomerId());
        }
        // Set minimal fields in the DTO with full details
        orderDTO.setCustomerId(fullCustomer.getCustomer_id());
        orderDTO.setCustomerName(fullCustomer.getCustomer_name());

        // Process order items and other logic as before...

        //Order order = orderMapper.toEntity(orderDTO);


        // --- Process Order Items ---
        if (orderDTO.getOrderItems() != null) {
            orderDTO.setOrderItems(
                    orderDTO.getOrderItems().stream().peek(item -> {
                        if (item.getProductId() == null || item.getQuantity() == null) {
                            throw new RuntimeException("Each order item must have a productId and quantity");
                        }

                        if (item.getProductName() == null || item.getUnitPrice() == null) {
                            var product = productService.getProductById(item.getProductId());
                            if (product == null) {
                                throw new RuntimeException("Product not found for id: " + item.getProductId());
                            }
                            item.setProductName(product.getProductName());

                            var latestPriceOpt = productWholesalePriceService.getLatestWholesalePrice(item.getProductId());
                            if (latestPriceOpt.isPresent()) {
                                item.setUnitPrice(latestPriceOpt.get());
                            } else {
                                throw new RuntimeException("No wholesale price found for product id: " + item.getProductId());
                            }
                        }

                        // Ensure discount is treated as a percentage
                        BigDecimal discountPercentage = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;

                        // Calculate total price before discount
                        BigDecimal totalPrice = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                        // Calculate discount amount (percentage-based)
                        BigDecimal discountAmount = totalPrice.multiply(discountPercentage).divide(BigDecimal.valueOf(100));

                        // Calculate final line total after discount
                        BigDecimal lineTotal = totalPrice.subtract(discountAmount);

                        // Set the calculated values back
                        item.setDiscount(discountAmount); // Store actual discount amount
                        item.setLineTotal(lineTotal);

                    }).collect(Collectors.toList())
            );
        }

        // --- Order Metadata ---
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderNumber("ORD-" + UUID.randomUUID());

        // --- Map DTO to Entity ---
        Order order = orderMapper.toEntity(orderDTO);

        order.setCustomerId(fullCustomer.getCustomer_id());
        order.setCustomerName(fullCustomer.getCustomer_name());


        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(item -> item.setOrder(order));
        }

        // --- Calculate Total Amount ---
        assert order.getOrderItems() != null;
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        // --- save Total Discount ---
        order.setTotalDiscount(order.getOrderItems().stream()
                .map(OrderItem::getDiscount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        // --- Save Order ---
        Order savedOrder = orderRepository.save(order);

        // --- Inventory Validation & Reservation ---
        for (var item : orderDTO.getOrderItems()) {
            List<BatchInventoryDTO> batches = batchInventoryService.getAllBatchInventories()
                    .stream()
                    .filter(b -> b.getProductId().equals(item.getProductId()))
                    .toList();

            int totalAvailable = batches.stream().mapToInt(BatchInventoryDTO::getAvailableUnitQuantity).sum();
            int totalReserved = inventoryReservationService.getTotalReservedForProduct(item.getProductId());
            int effectiveAvailable = totalAvailable - totalReserved;

            if (effectiveAvailable < item.getQuantity()) {
                throw new RuntimeException("Insufficient effective stock for product id: " + item.getProductId());
            }

            inventoryReservationService.reserveInventory(item.getProductId(), item.getQuantity(), savedOrder.getOrderId());
        }

        return orderMapper.toDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.getOrderItems().size();
        return orderMapper.toDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderMapper.toDTOList(orderRepository.findAll());
    }


    @Override
    @Transactional
    public OrderDTO updateOrder(Long orderId, OrderDTO orderDTO) {
        // Retrieve the existing order
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update order header details (customer details, etc.)
        existingOrder.setCustomerName(orderDTO.getCustomerName());

        // Option 1: If you want to update order items individually, you can iterate and update existing ones.
        // For simplicity, here we remove all existing order items and rebuild them from the input.

        // Clear current order items
        existingOrder.getOrderItems().clear();

        // Build new order items from the input DTO
        if (orderDTO.getOrderItems() != null) {
            List<OrderItem> updatedItems = orderDTO.getOrderItems().stream().map(itemDTO -> {
                OrderItem newItem = new OrderItem();
                newItem.setProductId(itemDTO.getProductId());
                newItem.setProductName(itemDTO.getProductName());
                newItem.setQuantity(itemDTO.getQuantity());
                newItem.setUnitPrice(itemDTO.getUnitPrice());
                // If discount is provided as percentage, you might need to recalc discount amount.
                // For this example, we assume discount in the DTO is the actual discount amount.
                BigDecimal totalPrice = itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
                BigDecimal discountAmount = (itemDTO.getDiscount() != null) ? itemDTO.getDiscount() : BigDecimal.ZERO;
                BigDecimal lineTotal = totalPrice.subtract(discountAmount);
                newItem.setDiscount(discountAmount);
                newItem.setLineTotal(lineTotal);
                newItem.setOrder(existingOrder); // Set the parent reference
                return newItem;
            }).collect(Collectors.toList());
            existingOrder.setOrderItems(updatedItems);
        }

        // Recalculate order totals based on the updated order items
        BigDecimal totalAmount = existingOrder.getOrderItems().stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existingOrder.setTotalAmount(totalAmount);

        BigDecimal totalDiscount = existingOrder.getOrderItems().stream()
                .map(OrderItem::getDiscount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existingOrder.setTotalDiscount(totalDiscount);

        // Save the updated order
        Order updatedOrder = orderRepository.save(existingOrder);

        // Return the updated order as a DTO
        return orderMapper.toDTO(updatedOrder);
    }


    @Override
    @Transactional
    public void deleteOrder(Long orderId) {
        // Retrieve the order first
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for id: " + orderId));
        // Delete associated inventory reservations for this order
        inventoryReservationService.deleteReservationsByOrderId(orderId);
        // Now delete the order itself
        orderRepository.delete(existingOrder);
    }


}
