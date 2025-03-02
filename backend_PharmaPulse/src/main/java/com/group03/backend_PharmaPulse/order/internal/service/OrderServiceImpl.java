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
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
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
        if (orderDTO.getCustomer_id() == null) {
            throw new RuntimeException("Customer ID is required");
        }
        // Retrieve full customer details from CustomerService
        var fullCustomer = customerService.getCustomerById(orderDTO.getCustomer_id());
        if (fullCustomer == null) {
            throw new RuntimeException("Customer not found for id: " + orderDTO.getCustomer_id());
        }
        // Set minimal fields in the DTO with full details
        orderDTO.setCustomer_id(fullCustomer.getCustomer_id());
        orderDTO.setCustomer_name(fullCustomer.getCustomer_name());

        // Process order items and other logic as before...

        //Order order = orderMapper.toEntity(orderDTO);


        // --- Process Order Items ---
        if (orderDTO.getOrderItems() != null) {
            orderDTO.setOrderItems(
                    orderDTO.getOrderItems().stream().map(item -> {
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

                        return item;
                    }).collect(Collectors.toList())
            );
        }

        // --- Order Metadata ---
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderNumber("ORD-" + UUID.randomUUID().toString());

        // --- Map DTO to Entity ---
        Order order = orderMapper.toEntity(orderDTO);

        order.setCustomerId(fullCustomer.getCustomer_id());
        order.setCustomerName(fullCustomer.getCustomer_name());


        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(item -> item.setOrder(order));
        }

        // --- Calculate Total Amount ---
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
                    .collect(Collectors.toList());

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


}
