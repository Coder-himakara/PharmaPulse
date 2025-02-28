package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import com.group03.backend_PharmaPulse.order.api.SalesInvoiceService;
import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoice;
import com.group03.backend_PharmaPulse.order.internal.mapper.SalesInvoiceMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.SalesInvoiceRepository;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SalesInvoiceServiceImpl implements SalesInvoiceService {

    private final SalesInvoiceRepository salesInvoiceRepository;
    private final SalesInvoiceMapper salesInvoiceMapper;
    private final BatchInventoryService batchInventoryService;
    private final InventoryReservationService inventoryReservationService;

    public SalesInvoiceServiceImpl(SalesInvoiceRepository salesInvoiceRepository,
                                   SalesInvoiceMapper salesInvoiceMapper,
                                   BatchInventoryService batchInventoryService,InventoryReservationService inventoryReservationService) {
        this.salesInvoiceRepository = salesInvoiceRepository;
        this.salesInvoiceMapper = salesInvoiceMapper;
        this.batchInventoryService = batchInventoryService;
        this.inventoryReservationService = inventoryReservationService;
    }

    @Override
    @Transactional
    public SalesInvoiceDTO createSalesInvoice(SalesInvoiceDTO salesInvoiceDTO) {
        salesInvoiceDTO.setInvoiceNumber("INV-" + UUID.randomUUID().toString());
        salesInvoiceDTO.setInvoiceDate(LocalDateTime.now());
        // Calculate totals, etc.
        SalesInvoice salesInvoice = salesInvoiceMapper.toEntity(salesInvoiceDTO);
        SalesInvoice savedInvoice = salesInvoiceRepository.save(salesInvoice);

        // For each invoice item, finalize reservation and update inventory
        salesInvoiceDTO.getInvoiceItems().forEach(item -> {
            // Deduct inventory from BatchInventory (using FIFO or your existing deduct logic)
            batchInventoryService.deductInventory(item.getProductId(), item.getQuantity());
            // Remove the corresponding reservation records
            inventoryReservationService.finalizeReservation(item.getProductId(), item.getQuantity(), savedInvoice.getOrderId());
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
