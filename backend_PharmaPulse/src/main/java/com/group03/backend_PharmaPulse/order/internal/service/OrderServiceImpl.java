package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import com.group03.backend_PharmaPulse.order.api.OrderService;
import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import com.group03.backend_PharmaPulse.order.internal.entity.OrderItem;
import com.group03.backend_PharmaPulse.order.internal.mapper.OrderMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.OrderRepository;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.ProductWholesalePriceService;
import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import com.group03.backend_PharmaPulse.order.api.dto.OrderItemDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        var fullCustomer = customerService.getCustomerById(orderDTO.getCustomerId());
        if (fullCustomer == null) {
            throw new RuntimeException("Customer not found for id: " + orderDTO.getCustomerId());
        }
        orderDTO.setCustomerId(fullCustomer.getCustomer_id());
        orderDTO.setCustomerName(fullCustomer.getCustomer_name());

        // --- Process Order Items with Batch Allocation ---
        // We'll allocate each order item based on available batches.
        List<OrderItemDTO> allocatedItems = new ArrayList<>();
        if (orderDTO.getOrderItems() != null) {
            for (OrderItemDTO item : orderDTO.getOrderItems()) {
                if (item.getProductId() == null || item.getQuantity() == null) {
                    throw new RuntimeException("Each order item must have a productId and quantity");
                }
                // Enrich product name if missing
                if (item.getProductName() == null) {
                    var product = productService.getProductById(item.getProductId());
                    if (product == null) {
                        throw new RuntimeException("Product not found for id: " + item.getProductId());
                    }
                    item.setProductName(product.getProductName());
                }
                // Use discount from the DTO as a percentage; default 0 if missing.
                BigDecimal discountPercentage = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;
                int requiredQuantity = item.getQuantity();

                // Retrieve available batches sorted by expiry (FIFO)
                List<BatchInventoryDTO> batches = batchInventoryService.getBatchesByProductIdSorted(item.getProductId());
                int remaining = requiredQuantity;
                // For each batch, allocate until the requirement is met
                for (BatchInventoryDTO batch : batches) {
                    if (remaining <= 0) break;
                    int available = batch.getAvailableUnitQuantity();
                    if (available <= 0) continue;
                    int allocateQty = Math.min(available, remaining);

                    // Create a new order item allocation
                    OrderItemDTO newItem = new OrderItemDTO();
                    newItem.setProductId(item.getProductId());
                    newItem.setProductName(item.getProductName());
                    newItem.setQuantity(allocateQty);
                    newItem.setUnitPrice(batch.getWholesalePrice());
                    // Calculate total price and discount amount for this allocation
                    BigDecimal totalPrice = batch.getWholesalePrice().multiply(BigDecimal.valueOf(allocateQty));
                    BigDecimal discountAmount = totalPrice.multiply(discountPercentage)
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    BigDecimal lineTotal = totalPrice.subtract(discountAmount);
                    newItem.setDiscount(discountAmount); // store actual discount amount
                    newItem.setLineTotal(lineTotal);

                    allocatedItems.add(newItem);
                    remaining -= allocateQty;
                }
                if (remaining > 0) {
                    throw new RuntimeException("Insufficient inventory to allocate " + requiredQuantity + " units for product id: " + item.getProductId());
                }
            }
            // Replace original order items with allocated items
            orderDTO.setOrderItems(allocatedItems);
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

        // --- Calculate Totals ---
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);
        BigDecimal totalDiscount = order.getOrderItems().stream()
                .map(OrderItem::getDiscount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalDiscount(totalDiscount);

        // --- Save Order ---
        Order savedOrder = orderRepository.save(order);

        // --- Inventory Validation & Reservation ---
        // For each allocated order item, validate inventory and reserve
        for (var item : orderDTO.getOrderItems()) {
            List<BatchInventoryDTO> availableBatches = batchInventoryService.getAllBatchInventories()
                    .stream()
                    .filter(b -> b.getProductId().equals(item.getProductId()))
                    .collect(Collectors.toList());
            int totalAvailable = availableBatches.stream().mapToInt(BatchInventoryDTO::getAvailableUnitQuantity).sum();
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
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setCustomerName(orderDTO.getCustomerName());
        // Remove existing order items and rebuild from input (similar to createOrder)
        existingOrder.getOrderItems().clear();
        if (orderDTO.getOrderItems() != null) {
            List<OrderItem> updatedItems = orderDTO.getOrderItems().stream().map(itemDTO -> {
                OrderItem newItem = new OrderItem();
                newItem.setProductId(itemDTO.getProductId());
                newItem.setProductName(itemDTO.getProductName());
                newItem.setQuantity(itemDTO.getQuantity());
                newItem.setUnitPrice(itemDTO.getUnitPrice());
                BigDecimal totalPrice = itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
                BigDecimal discountAmount = (itemDTO.getDiscount() != null) ? itemDTO.getDiscount() : BigDecimal.ZERO;
                BigDecimal lineTotal = totalPrice.subtract(discountAmount);
                newItem.setDiscount(discountAmount);
                newItem.setLineTotal(lineTotal);
                newItem.setOrder(existingOrder);
                return newItem;
            }).collect(Collectors.toList());
            existingOrder.setOrderItems(updatedItems);
        }
        BigDecimal totalAmount = existingOrder.getOrderItems().stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existingOrder.setTotalAmount(totalAmount);
        BigDecimal totalDiscount = existingOrder.getOrderItems().stream()
                .map(OrderItem::getDiscount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existingOrder.setTotalDiscount(totalDiscount);
        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapper.toDTO(updatedOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId) {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found for id: " + orderId));
        inventoryReservationService.deleteReservationsByOrderId(orderId);
        orderRepository.delete(existingOrder);
    }
}
