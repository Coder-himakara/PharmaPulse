package com.group03.backend_PharmaPulse.sales.internal.serviceImpl;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.api.CustomerGroupService;
import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import com.group03.backend_PharmaPulse.sales.internal.mapper.CustomerGroupMapper;
import com.group03.backend_PharmaPulse.sales.internal.repository.CustomerGroupRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        CustomerGroup savedCustomerGroup = customerGroupRepo.save(customerGroupMapper.toEntity(customerGroupDTO));
        return customerGroupMapper.toDTO(savedCustomerGroup);
    }

    @Override
    public List<CustomerGroupDTO> getAllCustomerGroups() {
        List<CustomerGroup> customerGroups = customerGroupRepo.findAll();
        return customerGroupMapper.toDTOsList(customerGroups); // Return empty list if none found
    }

    @Override
    public CustomerGroupDTO getCustomerGroupById(Long id) {
        Optional<CustomerGroup> customerGroup = customerGroupRepo.findById(id);
        return customerGroup.map(customerGroupMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("CustomerGroup not found"));
    }

    @Override
    public CustomerGroupDTO updateCustomerGroup(Long id, CustomerGroupDTO customerGroupDTO) {
        Optional<CustomerGroup> customerGroup = customerGroupRepo.findById(id);
        if (customerGroup.isPresent()) {
            CustomerGroup updatedCustomerGroup = customerGroupMapper.toEntity(customerGroupDTO);
            updatedCustomerGroup.setCustomerGroupId(id); // Ensure ID is preserved
            CustomerGroup savedCustomerGroup = customerGroupRepo.save(updatedCustomerGroup);
            return customerGroupMapper.toDTO(savedCustomerGroup);
        } else {
            throw new NotFoundException("CustomerGroup not found");
        }
    }
}