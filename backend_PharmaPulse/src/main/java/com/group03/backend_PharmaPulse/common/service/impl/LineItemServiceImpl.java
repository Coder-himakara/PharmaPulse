package com.group03.backend_PharmaPulse.common.service.impl;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.common.mapper.LineItemMapper;
import com.group03.backend_PharmaPulse.common.repository.LineItemRepo;
import com.group03.backend_PharmaPulse.common.service.LineItemService;
import org.springframework.stereotype.Service;

@Service
public class LineItemServiceImpl implements LineItemService {

    private LineItemRepo lineItemRepo;
    private LineItemMapper lineItemMapper;

    public LineItemServiceImpl(LineItemRepo lineItemRepo, LineItemMapper lineItemMapper) {
        this.lineItemRepo = lineItemRepo;
        this.lineItemMapper = lineItemMapper;
    }
    @Override
    public LineItemDTO addLineItem(LineItemDTO lineItemDTO) {
        LineItem savedLineItem = lineItemRepo.save(lineItemMapper.toEntity(lineItemDTO));
        return lineItemMapper.toDTO(savedLineItem);
    }
}
