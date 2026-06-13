package com.assignment.backend.dto;

import java.math.BigDecimal;

public record CartItemDto(
        Long productId,
        String title,
        BigDecimal price,
        Integer quantity
) {
}
