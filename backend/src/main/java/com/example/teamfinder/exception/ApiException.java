package com.example.teamfinder.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
