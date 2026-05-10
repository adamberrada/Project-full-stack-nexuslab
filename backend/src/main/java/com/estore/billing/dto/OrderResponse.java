package com.estore.billing.dto;

import com.estore.billing.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        Instant orderDate,
        BigDecimal totalAmount,
        OrderStatus status,
        List<OrderItemResponse> items
) {
}
