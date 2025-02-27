package com.group03.backend_PharmaPulse.order.internal.serviceImpl;

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

    public SalesInvoiceServiceImpl(SalesInvoiceRepository salesInvoiceRepository,
                                   SalesInvoiceMapper salesInvoiceMapper,
                                   BatchInventoryService batchInventoryService) {
        this.salesInvoiceRepository = salesInvoiceRepository;
        this.salesInvoiceMapper = salesInvoiceMapper;
        this.batchInventoryService = batchInventoryService;
    }

    @Override
    @Transactional
    public SalesInvoiceDTO createSalesInvoice(SalesInvoiceDTO salesInvoiceDTO) {
        salesInvoiceDTO.setInvoiceNumber("INV-" + UUID.randomUUID().toString());
        salesInvoiceDTO.setInvoiceDate(LocalDateTime.now());
        BigDecimal totalAmount = salesInvoiceDTO.getInvoiceItems().stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()))
                        .subtract(item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        salesInvoiceDTO.setTotalAmount(totalAmount);

        SalesInvoice salesInvoice = salesInvoiceMapper.toEntity(salesInvoiceDTO);
        SalesInvoice savedInvoice = salesInvoiceRepository.save(salesInvoice);

        // Finalize the sale by deducting the reserved quantities from the inventory
        salesInvoiceDTO.getInvoiceItems().forEach(item -> {
            batchInventoryService.deductInventory(item.getProductId(), item.getQuantity());
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
