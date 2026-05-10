package com.estore.customer.dto;

public record ProfileResponse(
        Long userId,
        String phone,
        String address,
        String city,
        String country
) {
}
