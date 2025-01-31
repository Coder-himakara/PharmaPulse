package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.exception.NotFoundException;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.repository.ProductRepo;
import com.group03.backend_PharmaPulse.inventory.service.ProductRetailPriceService;
import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseLineItem;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseInvoiceMapper;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseLineItemMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseInvoiceRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseInvoiceService;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseLineItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class PurchaseInvoiceImpl implements PurchaseInvoiceService {

    private final PurchaseInvoiceRepo purchaseInvoiceRepo;
    private final PurchaseInvoiceMapper purchaseInvoiceMapper;
    private final PurchaseLineItemMapper purchaseLineItemMapper;
    private final PurchaseLineItemService purchaseLineItemService;
    private final ProductRepo productRepo;
    private final ProductRetailPriceService productRetailPriceService;

    public PurchaseInvoiceImpl(PurchaseInvoiceRepo purchaseInvoiceRepo, PurchaseInvoiceMapper purchaseInvoiceMapper,
                               PurchaseLineItemMapper purchaseLineItemMapper,
                               PurchaseLineItemService purchaseLineItemService,ProductRepo productRepo,
                               ProductRetailPriceService productRetailPriceService) {
        this.purchaseInvoiceRepo = purchaseInvoiceRepo;
        this.purchaseInvoiceMapper = purchaseInvoiceMapper;
        this.purchaseLineItemMapper = purchaseLineItemMapper;
        this.purchaseLineItemService = purchaseLineItemService;
        this.productRepo = productRepo;
        this.productRetailPriceService = productRetailPriceService;
    }

    @Override
    public List<PurchaseInvoiceDTO> getAllPurchaseInvoices() {
        return null;
    }

    @Override
    public PurchaseInvoiceDTO getPurchaseInvoicesById(int purchaseNo) {
        return null;
    }

/**
 * Method to add the Purchase Invoice and LineItems to the database
 * after including all the validated information by the user.
 * During the transaction, Retail Price of the Product is also checked and updated.
 * During the transaction, new Batch Inventory is also added.
 */

    @Override
    @Transactional
    public PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO) {
        //Transaction to add the Purchase Invoice
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
        //Transaction to add the LineItems
        if(purchaseInvoiceRepo.existsById(purchaseInvoice.getInvoiceId())){
            List<PurchaseLineItem> purchaseLineItems = purchaseLineItemMapper.toEntityList(purchaseInvoiceDTO.getLineItemsList());
            for (PurchaseLineItem lineItem : purchaseLineItems) {
                //Set the InvoiceNo to LineItem
                lineItem.setPurchaseInvoice(purchaseInvoice);
                //Set the ProductID to LineItem
                Product product = productRepo.findById(lineItem.getProduct().getProductId())
                        .orElseThrow(() -> new NotFoundException("Product not found"));
                lineItem.setProduct(product);
            }
            if(!purchaseLineItems.isEmpty()){
                purchaseLineItemService.addPurchaseLineItems(purchaseLineItems);
                for(PurchaseLineItem lineItem : purchaseLineItems){
                    //Check and Update the Retail Price of the Product
                    productRetailPriceService.checkAndUpdateRetailPrice(lineItem.getProduct(),lineItem.getDiscountAmount());
                }
            }else{
                throw new NotFoundException("Line Items not found");
            }

        }else {
            throw new NotFoundException("Purchase Invoice not found");
        }
        return purchaseInvoiceMapper.toDTO(purchaseInvoice);
    }
}
