package com.group03.backend_PharmaPulse.advisor;

import com.group03.backend_PharmaPulse.user.api.exception.TokenExpiredException;
import com.group03.backend_PharmaPulse.user.api.exception.TokenNotFoundException;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import com.group03.backend_PharmaPulse.util.api.dto.ErrorResponseDto;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;



import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class AppWideExceptionHandler{

    // Handle general exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleAllUncaughtException(Exception ex) {
        return new ResponseEntity<>(
                new ErrorResponseDto(500, "An unexpected error occurred", ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
    // Handle 404 PageNotFound errors
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpServletRequest httpServletRequest) {
        ErrorResponseDto error = new ErrorResponseDto(
                404,
                "Page Not Found",
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    // Handle null/invalid request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ErrorResponseDto error = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Malformed JSON request or null input data",
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponseDto error = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors.toString()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    // Handle NotFoundException for specific resources
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(404, "Resource Not Found", e.getMessage()),
                HttpStatus.NOT_FOUND
        );
    }
    // Handle authentication exceptions (e.g. invalid credentials)
    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponseDto> handleAuthenticationException(Exception e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(401, "Username or Password is incorrect", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(400, "Bad Request", e.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }
    @ExceptionHandler(AccountStatusException.class)
    public ResponseEntity<ErrorResponseDto> handleAccountStatusException(AccountStatusException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(401, "User Account is abnormal", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
    // Handle JWT token signature invalid exceptions
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponseDto> handleSignatureException(SignatureException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(401, "The access token provided is " +
                        "revoked, malformed or invalid", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
    // Handle JWT token expiration exceptions
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponseDto> handleExpiredJwtException(ExpiredJwtException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(401, "The access token provided is expired", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
    //Handle unauthorized access exceptions
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDeniedException(AccessDeniedException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(403, "No Permission", e.getMessage()),
                HttpStatus.FORBIDDEN
        );
    }
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponseDto> handleTokenExpiredException(TokenExpiredException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(401, "Token Expired", e.getMessage()),
                HttpStatus.UNAUTHORIZED
        );
    }
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleTokenNotFoundException(TokenNotFoundException e) {
        return new ResponseEntity<>(
                new ErrorResponseDto(404, "Token Not Found", e.getMessage()),
                HttpStatus.NOT_FOUND
        );
    }
}
