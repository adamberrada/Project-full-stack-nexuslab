package com.estore.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
        @NotNull Long productId,
        @NotNull Long userId,
        @NotBlank String authorName,
        @Min(1) @Max(5) int rating,
        @NotBlank String comment
) {
}
