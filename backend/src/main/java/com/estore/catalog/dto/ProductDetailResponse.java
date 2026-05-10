package com.estore.catalog.dto;

import java.math.BigDecimal;

public record ProductDetailResponse(
        Long id,
        String name,
        BigDecimal price,
        String imageUrl,
        String description,
        CategoryResponse category,
        int availableQuantity
) {
}
