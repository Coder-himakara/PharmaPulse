package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.ProductReferenceIdGenerator;
import com.group03.backend_PharmaPulse.product.internal.entity.SupplierProductSequence;
import com.group03.backend_PharmaPulse.product.internal.repository.SupplierProductSequenceRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductReferenceIdGeneratorImpl implements ProductReferenceIdGenerator {
    private static final String ID_FORMAT = "%s-%03d";
    private SupplierProductSequenceRepo supplierProductSequenceRepo;

    public ProductReferenceIdGeneratorImpl(SupplierProductSequenceRepo supplierProductSequenceRepo) {
        this.supplierProductSequenceRepo = supplierProductSequenceRepo;
    }

    public String generateProductReferenceId(String supplierId) {
        // Get or create sequence for the supplier
        SupplierProductSequence sequence = supplierProductSequenceRepo
                .findById(supplierId)
                .orElseGet(() -> {
                    SupplierProductSequence newSequence = new SupplierProductSequence();
                    newSequence.setSupplierId(supplierId);
                    newSequence.setCurrentSequence(0);
                    return newSequence;
                });

        // Increment the sequence
        sequence.setCurrentSequence(sequence.getCurrentSequence() + 1);
        supplierProductSequenceRepo.save(sequence);

        // Format the product reference ID
        return String.format(ID_FORMAT, supplierId, sequence.getCurrentSequence());
    }
}
