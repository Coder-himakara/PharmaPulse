package com.group03.backend_PharmaPulse.common.service.impl;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.common.mapper.LineItemMapper;
import com.group03.backend_PharmaPulse.common.repository.LineItemRepo;
import com.group03.backend_PharmaPulse.common.service.LineItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LineItemServiceImpl implements LineItemService {

    private final LineItemRepo lineItemRepo;
    private final LineItemMapper lineItemMapper;

    public LineItemServiceImpl(LineItemRepo lineItemRepo, LineItemMapper lineItemMapper) {
        this.lineItemRepo = lineItemRepo;
        this.lineItemMapper = lineItemMapper;
    }
    @Override
    public LineItemDTO addLineItem(LineItemDTO lineItemDTO) {
        LineItem savedLineItem = lineItemRepo.save(lineItemMapper.toEntity(lineItemDTO));
        return lineItemMapper.toDTO(savedLineItem);
    }
    // Add a list of line items when adding any invoice to the database
    @Override
    public List<LineItem> addLineItems(List<LineItem> lineItems) {
        return lineItemRepo.saveAll(lineItems);
    }
}
