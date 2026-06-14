package com.assignment.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponseDto(
        Long cartId,
        Long customerId,
        List<CartItemDto> items,
        BigDecimal total
) {
}
