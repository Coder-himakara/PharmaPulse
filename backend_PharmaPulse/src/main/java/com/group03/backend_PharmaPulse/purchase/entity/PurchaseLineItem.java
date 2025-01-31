package com.group03.backend_PharmaPulse.purchase.entity;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@Table(name = "purchase_line_item")
@PrimaryKeyJoinColumn(name = "line_item_id")
public class PurchaseLineItem extends LineItem {

    private BigDecimal costPerUnit;
    private BigDecimal totalCost;
    private LocalDate manufactureDate;
    private LocalDate  expiryDate;
    private BigDecimal unitPrice; //check and rename.Retail price of the product

    public PurchaseLineItem(Invoice invoice, Product product, Integer quantityByPackage,
                            Long conversionFactor, BigDecimal discountAmount,
                            BigDecimal costPerUnit, BigDecimal totalCost, LocalDate manufactureDate,
                            LocalDate expiryDate, BigDecimal unitPrice) {
        super(invoice, product, quantityByPackage, conversionFactor, discountAmount);
        this.costPerUnit = costPerUnit;
        this.totalCost = totalCost;
        this.manufactureDate = manufactureDate;
        this.expiryDate = expiryDate;
        this.unitPrice = unitPrice;
    }
}
