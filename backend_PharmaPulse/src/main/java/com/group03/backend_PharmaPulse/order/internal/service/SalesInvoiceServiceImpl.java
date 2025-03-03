package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.order.api.SalesInvoiceService;
import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoice;
import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoiceItem;
import com.group03.backend_PharmaPulse.order.internal.mapper.SalesInvoiceItemMapper;
import com.group03.backend_PharmaPulse.order.internal.mapper.SalesInvoiceMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.SalesInvoiceRepository;
import com.group03.backend_PharmaPulse.order.internal.repository.OrderRepository;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SalesInvoiceServiceImpl implements SalesInvoiceService {

    private final SalesInvoiceRepository salesInvoiceRepository;
    private final SalesInvoiceMapper salesInvoiceMapper;
    private final BatchInventoryService batchInventoryService;
    private final InventoryReservationService inventoryReservationService;
    private final OrderRepository orderRepository; // To retrieve order details
    private final SalesInvoiceItemMapper salesInvoiceItemMapper;

    public SalesInvoiceServiceImpl(SalesInvoiceRepository salesInvoiceRepository,
                                   SalesInvoiceMapper salesInvoiceMapper,
                                   BatchInventoryService batchInventoryService,
                                   InventoryReservationService inventoryReservationService,
                                   OrderRepository orderRepository,
                                   SalesInvoiceItemMapper salesInvoiceItemMapper) {
        this.salesInvoiceRepository = salesInvoiceRepository;
        this.salesInvoiceMapper = salesInvoiceMapper;
        this.batchInventoryService = batchInventoryService;
        this.inventoryReservationService = inventoryReservationService;
        this.orderRepository = orderRepository;
        this.salesInvoiceItemMapper = salesInvoiceItemMapper;
    }

    @Override
    @Transactional
    public SalesInvoiceDTO createSalesInvoice(SalesInvoiceDTO salesInvoiceDTO) {
        // Validate that orderId is provided
        if (salesInvoiceDTO.getOrderId() == null) {
            throw new RuntimeException("Order ID is required to generate a Sales Invoice");
        }
        // Retrieve the Order from the database
        Order order = orderRepository.findById(salesInvoiceDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found for id: " + salesInvoiceDTO.getOrderId()));

        // ***** Set Customer Details from Order into SalesInvoiceDTO *****
        salesInvoiceDTO.setCustomerId(order.getCustomerId());
        salesInvoiceDTO.setCustomerName(order.getCustomerName());

        // Set basic invoice metadata
        salesInvoiceDTO.setInvoiceNumber("INV-" + UUID.randomUUID().toString());
        salesInvoiceDTO.setInvoiceDate(LocalDateTime.now());

        // If invoice items are not provided, build them from Order's items
        if (salesInvoiceDTO.getInvoiceItems() == null || salesInvoiceDTO.getInvoiceItems().isEmpty()) {
            List<SalesInvoiceItem> invoiceItems = order.getOrderItems().stream().map(orderItem -> {
                SalesInvoiceItem invoiceItem = new SalesInvoiceItem();
                invoiceItem.setProductId(orderItem.getProductId());
                invoiceItem.setQuantity(orderItem.getQuantity());
                invoiceItem.setUnitPrice(orderItem.getUnitPrice());
                invoiceItem.setDiscount(orderItem.getDiscount());
                invoiceItem.setLineTotal(orderItem.getLineTotal());
                return invoiceItem;
            }).collect(Collectors.toList());
            // Map invoice items to DTOs via SalesInvoiceItemMapper (if needed)
            salesInvoiceDTO.setInvoiceItems(salesInvoiceItemMapper.toDTOList(invoiceItems));
        }

        // Calculate totals from the Order's items
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(item -> item.getLineTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDiscount = order.getOrderItems().stream()
                .map(item -> {
                    BigDecimal linePrice = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    return linePrice.subtract(item.getLineTotal());
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        salesInvoiceDTO.setTotalAmount(totalAmount);
        salesInvoiceDTO.setTotalDiscount(totalDiscount);

        // Create the SalesInvoice entity from the DTO
        SalesInvoice salesInvoice = salesInvoiceMapper.toEntity(salesInvoiceDTO);
        // Build invoice items manually if needed
        List<SalesInvoiceItem> invoiceItems = order.getOrderItems().stream().map(orderItem -> {
            SalesInvoiceItem item = new SalesInvoiceItem();
            item.setProductId(orderItem.getProductId());
            item.setQuantity(orderItem.getQuantity());
            item.setUnitPrice(orderItem.getUnitPrice());
            item.setDiscount(orderItem.getDiscount());
            item.setLineTotal(orderItem.getLineTotal());
            item.setSalesInvoice(salesInvoice);
            return item;
        }).collect(Collectors.toList());
        salesInvoice.setInvoiceItems(invoiceItems);
        // Link SalesInvoice to the Order
        salesInvoice.setOrderId(order.getOrderId());
        // ***** Set customer details into the SalesInvoice entity *****
        salesInvoice.setCustomerId(order.getCustomerId());
        salesInvoice.setCustomerName(order.getCustomerName());

        // Save the SalesInvoice
        SalesInvoice savedInvoice = salesInvoiceRepository.save(salesInvoice);

        // Deduct inventory and finalize reservations for each invoice item
        savedInvoice.getInvoiceItems().forEach(item -> {
            batchInventoryService.deductInventory(item.getProductId(), item.getQuantity());
            inventoryReservationService.finalizeReservation(item.getProductId(), item.getQuantity(), order.getOrderId());
        });

        return salesInvoiceMapper.toDTO(savedInvoice);
    }

    @Override
    public SalesInvoiceDTO getSalesInvoiceById(Long invoiceId) {
        SalesInvoice salesInvoice = salesInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return salesInvoiceMapper.toDTO(salesInvoice);
    }

    @Override
    public List<SalesInvoiceDTO> getAllSalesInvoices() {
        return salesInvoiceMapper.toDTOList(salesInvoiceRepository.findAll());
    }
}
