package com.example.teamfinder.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterRequestValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void acceptsRegistrationWithoutOptionalProfileFields() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("snehith.test.2026@example.com");
        request.setPassword("Test@12345");

        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void rejectsInvalidEmailAndShortPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("not-an-email");
        request.setPassword("123");

        var violations = validator.validate(request);

        assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("password")));
    }

    @Test
    void rejectsYearOutsideSupportedRangeWhenProvided() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("snehith.test.2026@example.com");
        request.setPassword("Test@12345");
        request.setYear(6);

        assertTrue(validator.validate(request).stream()
            .anyMatch(violation -> violation.getPropertyPath().toString().equals("year")));
    }
}
