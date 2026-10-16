package com.startupsync.auth.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 100;

    @Override
    public void initialize(ValidPassword annotation) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return true; // Will be caught by @NotBlank
        }

        boolean valid = password.length() >= MIN_LENGTH &&
                password.length() <= MAX_LENGTH &&
                hasUpperCase(password) &&
                hasLowerCase(password) &&
                hasDigit(password) &&
                hasSpecialChar(password);

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Password must be 8-100 characters and contain uppercase, lowercase, digit, and special character"
            ).addConstraintViolation();
        }

        return valid;
    }

    private boolean hasUpperCase(String password) {
        return password.matches(".*[A-Z].*");
    }

    private boolean hasLowerCase(String password) {
        return password.matches(".*[a-z].*");
    }

    private boolean hasDigit(String password) {
        return password.matches(".*[0-9].*");
    }

    private boolean hasSpecialChar(String password) {
        return password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
    }
}
