package com.example.teamfinder.exception;

import org.junit.jupiter.api.Test;
import com.example.teamfinder.dto.RegisterRequest;
import org.springframework.core.MethodParameter;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Method;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    @Test
    void returnsBadRequestWithFieldDetailsForInvalidRegistration() throws NoSuchMethodException {
        RegisterRequest request = new RegisterRequest();
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(request, "registerRequest");
        bindingResult.addError(new FieldError("registerRequest", "email", "must be a valid email"));
        Method endpoint = GlobalExceptionHandlerTest.class.getDeclaredMethod("registrationEndpoint", RegisterRequest.class);
        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(
            new MethodParameter(endpoint, 0), bindingResult
        );

        var response = new GlobalExceptionHandler().handleValidation(exception);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Please correct the highlighted registration fields.", response.getBody().get("message"));
        assertEquals(Map.of("email", "must be a valid email"), response.getBody().get("errors"));
    }

    private void registrationEndpoint(RegisterRequest request) {
    }
}
