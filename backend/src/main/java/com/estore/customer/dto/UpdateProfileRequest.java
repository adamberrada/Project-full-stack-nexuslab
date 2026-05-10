package com.estore.customer.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 40) String phone,
        @Size(max = 255) String address,
        @Size(max = 80) String city,
        @Size(max = 80) String country
) {
}
