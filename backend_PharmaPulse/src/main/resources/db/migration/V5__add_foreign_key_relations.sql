SET search_path TO public;

ALTER TABLE purchase_line_item
    ADD CONSTRAINT FK_PURCHASE_LINE_ITEM_ON_PURCHASE_INVOICE FOREIGN KEY (purchase_invoice) REFERENCES purchase_invoice (invoice_id);

ALTER TABLE product
    ADD CONSTRAINT FK_PRODUCT_ON_PURCHASE_GROUP FOREIGN KEY (purchase_group_id) REFERENCES purchase_group (purchase_group_id);

ALTER TABLE batch_inventory
    ADD CONSTRAINT FK_BATCH_INVENTORY_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES product (product_id);

ALTER TABLE batch_inventory
    ADD CONSTRAINT FK_BATCH_INVENTORY_ON_PURCHASE_INVOICE FOREIGN KEY (purchase_invoice_no) REFERENCES purchase_invoice (invoice_id);

ALTER TABLE purchase_invoice
    ADD CONSTRAINT FK_PURCHASE_INVOICE_ON_SUPPLIER FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id);