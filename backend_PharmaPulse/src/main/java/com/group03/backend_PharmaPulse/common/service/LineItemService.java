package com.group03.backend_PharmaPulse.common.service;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.LineItem;

import java.util.List;

public interface LineItemService {
    LineItemDTO addLineItem(LineItemDTO lineItemDTO);
    List<LineItem> addLineItems(List<LineItem> lineItems);
}
