package com.group03.backend_PharmaPulse.purchase.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.ProductRetailPriceService;
import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.shared.InvoiceReference;
import com.group03.backend_PharmaPulse.exception.NotFoundException;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.internal.mapper.PurchaseInvoiceMapper;
import com.group03.backend_PharmaPulse.purchase.internal.mapper.PurchaseLineItemMapper;
import com.group03.backend_PharmaPulse.purchase.internal.repository.PurchaseInvoiceRepo;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseInvoiceService;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseLineItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class PurchaseInvoiceServiceImpl implements PurchaseInvoiceService {

    private final PurchaseInvoiceRepo purchaseInvoiceRepo;
    private final PurchaseInvoiceMapper purchaseInvoiceMapper;
    private final PurchaseLineItemMapper purchaseLineItemMapper;
    private final PurchaseLineItemService purchaseLineItemService;
    private final ProductRetailPriceService productRetailPriceService;

    public PurchaseInvoiceServiceImpl(PurchaseInvoiceRepo purchaseInvoiceRepo,
                                      PurchaseInvoiceMapper purchaseInvoiceMapper,
                                      PurchaseLineItemMapper purchaseLineItemMapper,
                                      PurchaseLineItemService purchaseLineItemService,
                                      ProductRetailPriceService productRetailPriceService) {
        this.purchaseInvoiceRepo = purchaseInvoiceRepo;
        this.purchaseInvoiceMapper = purchaseInvoiceMapper;
        this.purchaseLineItemMapper = purchaseLineItemMapper;
        this.purchaseLineItemService = purchaseLineItemService;
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
 * Method to add the Purchase Invoice and Purchase LineItem details to the database
 * Prerequisites: Validated information by the user.
 * During the transaction, Retail Price of each Product is checked and updated.
 * During the transaction, event is triggered to add new Batch Inventory.
 */

    @Override
    @Transactional
    public PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO) {
        //1. Transaction to add the Purchase Invoice
        PurchaseInvoice purchaseInvoice = purchaseInvoiceMapper.toEntity(purchaseInvoiceDTO);
        purchaseInvoiceRepo.save(purchaseInvoice);

        //2. Transaction to add the Purchase LineItems
        if(purchaseInvoiceRepo.existsById(purchaseInvoice.getInvoiceId())){
            List<PurchaseLineItemDTO> purchaseLineItems = purchaseInvoiceDTO.getLineItemsList();

            for (PurchaseLineItemDTO lineItem : purchaseLineItems) {
                //Set the InvoiceNo to LineItem
                lineItem.setPurchaseInvoice(purchaseInvoice.getPurchaseNo());
            }
            if(!purchaseLineItems.isEmpty()){
                //Add the Purchase LineItems to the database
                //This will publish an event
                purchaseLineItemService.addPurchaseLineItems(purchaseLineItemMapper.toEntityList(purchaseLineItems));
                //Check and Update the Retail Price of the Product
                for(PurchaseLineItemDTO lineItemDTO : purchaseLineItems){
                    productRetailPriceService.checkAndUpdateRetailPrice
                            (lineItemDTO.getProductId(),lineItemDTO.getUnitPrice());
                }
            }else{
                throw new NotFoundException("Purchase Line Items not found");
            }
        }else {
            throw new NotFoundException("Purchase Invoice not found");
        }
        return purchaseInvoiceMapper.toDTO(purchaseInvoice);
    }

    //fetch and map PurchaseInvoice entities to the InvoiceReference interface
    public InvoiceReference toView(PurchaseInvoice purchaseInvoice){
        return new InvoiceReference() {
            @Override
            public Long getInvoiceId() {
                return purchaseInvoice.getInvoiceId();
            }

            @Override
            public String getInvoiceNo() {
                return purchaseInvoice.getInvoiceNo();
            }
        };
    }
}
