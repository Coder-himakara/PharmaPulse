package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import com.group03.backend_PharmaPulse.order.api.OrderService;
import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import com.group03.backend_PharmaPulse.order.internal.mapper.OrderMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.OrderRepository;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    // Used to check available stock and reserve inventory temporarily
    private final BatchInventoryService batchInventoryService;
    private final InventoryReservationService inventoryReservationService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderMapper orderMapper,
                            BatchInventoryService batchInventoryService,InventoryReservationService inventoryReservationService) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.batchInventoryService = batchInventoryService;
        this.inventoryReservationService = inventoryReservationService;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Generate order details
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderNumber("ORD-" + UUID.randomUUID().toString());

        // Save order first to obtain an orderId
        Order order = orderMapper.toEntity(orderDTO);

        //new
        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(item -> item.setOrder(order));
        }
        Order savedOrder = orderRepository.save(order);

        // For each order item, validate effective available stock and reserve inventory
        orderDTO.getOrderItems().forEach(item -> {
            // Retrieve batches for the product
            List<BatchInventoryDTO> batches = batchInventoryService.getAllBatchInventories()
                    .stream()
                    .filter(b -> b.getProductId().equals(item.getProductId()))
                    .collect(Collectors.toList());

            // Sum available units from all batches (assuming here availableUnitQuantity is not altered)
            int totalAvailable = batches.stream().mapToInt(BatchInventoryDTO::getAvailableUnitQuantity).sum();
            // Get already reserved quantity from the reservation table
            int totalReserved = inventoryReservationService.getTotalReservedForProduct(item.getProductId());
            int effectiveAvailable = totalAvailable - totalReserved;

            if (effectiveAvailable < item.getQuantity()) {
                throw new RuntimeException("Insufficient effective stock for product id: " + item.getProductId());
            }

            // Reserve inventory in the separate reservation table
            inventoryReservationService.reserveInventory(item.getProductId(), item.getQuantity(), savedOrder.getOrderId());
        });

        return orderMapper.toDTO(savedOrder);
    }



    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
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
        // Update customer details and recalculate totals as needed
        existingOrder.setCustomerName(orderDTO.getCustomer().getCustomer_name());
        existingOrder.setCustomerAddress(orderDTO.getCustomer().getCustomer_address());
        existingOrder.setCustomerContact(orderDTO.getCustomer().getCustomer_contact_name());
        BigDecimal totalAmount = orderDTO.getOrderItems().stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()))
                        .subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existingOrder.setTotalAmount(totalAmount);
        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapper.toDTO(updatedOrder);
    }
}
