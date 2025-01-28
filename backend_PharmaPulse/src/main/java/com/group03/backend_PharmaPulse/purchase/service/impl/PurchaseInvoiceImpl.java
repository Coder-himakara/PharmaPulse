package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.common.mapper.LineItemMapper;
import com.group03.backend_PharmaPulse.common.service.LineItemService;
import com.group03.backend_PharmaPulse.exception.NotFoundException;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.repository.ProductRepo;
import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseInvoiceMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseInvoiceRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseInvoiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class PurchaseInvoiceImpl implements PurchaseInvoiceService {

    private final PurchaseInvoiceRepo purchaseInvoiceRepo;
    private final PurchaseInvoiceMapper purchaseInvoiceMapper;
    private final LineItemMapper lineItemMapper;
    private final LineItemService lineItemService;
    private final ProductRepo productRepo;

    public PurchaseInvoiceImpl(PurchaseInvoiceRepo purchaseInvoiceRepo, PurchaseInvoiceMapper purchaseInvoiceMapper,
                               LineItemMapper lineItemMapper, LineItemService lineItemService,ProductRepo productRepo) {
        this.purchaseInvoiceRepo = purchaseInvoiceRepo;
        this.purchaseInvoiceMapper = purchaseInvoiceMapper;
        this.lineItemMapper = lineItemMapper;
        this.lineItemService = lineItemService;
        this.productRepo = productRepo;
    }

    @Override
    public List<PurchaseInvoiceDTO> getAllPurchaseInvoices() {
        return null;
    }

    @Override
    public PurchaseInvoiceDTO getPurchaseInvoicesById(int purchaseNo) {
        return null;
    }

    @Override
    @Transactional
    public PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO) {
        PurchaseInvoice purchaseInvoice = new PurchaseInvoice(
                purchaseInvoiceDTO.getInvoiceStatus(),
                purchaseInvoiceDTO.getInvoiceDate(),
                purchaseInvoiceDTO.getInvoiceNo(),
                purchaseInvoiceDTO.getPaymentType(),
                purchaseInvoiceDTO.getTotalAmount(),
                purchaseInvoiceDTO.getDiscountAmount(),
                purchaseInvoiceDTO.getNetAmount(),
                purchaseInvoiceDTO.getPurchaseNo(),
                purchaseInvoiceDTO.getSupplierId(),
                purchaseInvoiceDTO.getPurchaseOrderRef()
        );
        purchaseInvoiceRepo.save(purchaseInvoice);

        if(purchaseInvoiceRepo.existsById(purchaseInvoice.getInvoiceId())){
            List<LineItem> lineItems =lineItemMapper.toEntityList(purchaseInvoiceDTO.getLineItemsList());
            for (LineItem lineItem : lineItems) {
                //Set the InvoiceNo to LineItem
                lineItem.setInvoice(purchaseInvoice);
                //Set the ProductID to LineItem
                Product product = productRepo.findById(lineItem.getProduct().getProduct_id())
                        .orElseThrow(() -> new NotFoundException("Product not found"));
                lineItem.setProduct(product);
            }
            if(!lineItems.isEmpty()){
                lineItemService.addLineItems(lineItems);
            }else{
                throw new NotFoundException("Line Items not found");
            }

        }else {
            throw new NotFoundException("Purchase Invoice not found");
        }
        return purchaseInvoiceMapper.toDTO(purchaseInvoice);
    }
}
