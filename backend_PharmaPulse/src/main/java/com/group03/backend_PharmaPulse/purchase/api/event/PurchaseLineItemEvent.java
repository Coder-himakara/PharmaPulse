package com.group03.backend_PharmaPulse.purchase.api.event;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.util.List;
@Getter
@Setter
public class PurchaseLineItemEvent extends ApplicationEvent {
    private List<PurchaseLineItemDTO> purchaseLineItemDTOS;
    public PurchaseLineItemEvent(Object source, List<PurchaseLineItemDTO> purchaseLineItemDTOS) {
        super(source);
        this.purchaseLineItemDTOS=purchaseLineItemDTOS;
    }
}
