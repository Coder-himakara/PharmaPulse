package com.group03.backend_PharmaPulse.advisor;

import com.group03.backend_PharmaPulse.exception.NotFoundException;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppWideExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardResponse> handleException(Exception e) {
        return new ResponseEntity<>(
                new StandardResponse(500, "Error Found", e.getCause() + " Please try again later"),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<StandardResponse> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(
                new StandardResponse(404, "Error Found", e.getMessage()+" not found"),
                HttpStatus.NOT_FOUND
        );
    }
}
