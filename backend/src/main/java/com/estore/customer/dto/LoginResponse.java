package com.estore.customer.dto;

public record LoginResponse(
        Long userId,
        String firstName,
        String lastName,
        String email
) {
}
