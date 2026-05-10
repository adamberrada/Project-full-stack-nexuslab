package com.estore.catalog.dto;

import java.math.BigDecimal;

public record ProductSummaryResponse(
        Long id,
        String name,
        BigDecimal price,
        String imageUrl,
        CategoryResponse category,
        int availableQuantity
) {
}
