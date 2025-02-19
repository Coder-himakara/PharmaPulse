package com.group03.backend_PharmaPulse.sales.internal.serviceImpl;

import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.api.event.CustomerGroupService;
import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import com.group03.backend_PharmaPulse.sales.internal.mapper.CustomerGroupMapper;
import com.group03.backend_PharmaPulse.sales.internal.repository.CustomerGroupRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerGroupServiceImpl implements CustomerGroupService {

    private final CustomerGroupRepo customerGroupRepo;
    private final CustomerGroupMapper customerGroupMapper;

    public CustomerGroupServiceImpl(CustomerGroupRepo customerGroupRepo, CustomerGroupMapper customerGroupMapper) {
        this.customerGroupRepo = customerGroupRepo;
        this.customerGroupMapper = customerGroupMapper;
    }

    @Override
    public CustomerGroupDTO addCustomerGroup(CustomerGroupDTO customerGroupDTO) {
        CustomerGroup savedCustomerGroup= customerGroupRepo.save(customerGroupMapper.toEntity(customerGroupDTO));
        return customerGroupMapper.toDTO(savedCustomerGroup);
    }

    @Override
    public List<CustomerGroupDTO> getAllCustomerGroups() {
        return List.of();
    }

    @Override
    public CustomerGroupDTO getCustomerGroupById(Long id) {
        return null;
    }

    @Override
    public CustomerGroupDTO updateCustomerGroup(Long id, CustomerGroupDTO customerGroupDTO) {
        return null;
    }
}
