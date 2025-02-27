package com.group03.backend_PharmaPulse.order.internal.serviceImpl;

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

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    // Used to check available stock and reserve inventory temporarily
    private final BatchInventoryService batchInventoryService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderMapper orderMapper,
                            BatchInventoryService batchInventoryService) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.batchInventoryService = batchInventoryService;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Validate each order item against available stock and reserve temporary inventory
        orderDTO.getOrderItems().forEach(item -> {
            List<BatchInventoryDTO> batches = batchInventoryService.getAllBatchInventories();
            boolean available = batches.stream()
                    .filter(b -> b.getProductId().equals(item.getProductId()))
                    .anyMatch(b -> b.getAvailableUnitQuantity() >= item.getQuantity());
            if (!available) {
                throw new RuntimeException("Insufficient stock for product id: " + item.getProductId());
            }
            // Reserve temporary inventory for this order item
            batchInventoryService.reserveInventory(item.getProductId(), item.getQuantity());
        });

        // Calculate order total
        BigDecimal totalAmount = orderDTO.getOrderItems().stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()))
                        .subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        orderDTO.setTotalAmount(totalAmount);
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderNumber("ORD-" + UUID.randomUUID().toString());

        Order order = orderMapper.toEntity(orderDTO);
        Order savedOrder = orderRepository.save(order);
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
