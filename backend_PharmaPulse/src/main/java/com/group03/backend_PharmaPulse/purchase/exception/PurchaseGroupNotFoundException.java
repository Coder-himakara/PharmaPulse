package com.group03.backend_PharmaPulse.purchase.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND)
public class PurchaseGroupNotFoundException extends RuntimeException {
    public PurchaseGroupNotFoundException(String message) {
        super(message);
    }
}
