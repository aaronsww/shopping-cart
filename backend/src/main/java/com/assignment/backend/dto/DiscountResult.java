package com.assignment.backend.dto;

import java.math.BigDecimal;

public record DiscountResult(
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String appliedDiscountCode
) {
    public static DiscountResult none(BigDecimal subtotal) {
        return new DiscountResult(BigDecimal.ZERO, subtotal, null);
    }
}
