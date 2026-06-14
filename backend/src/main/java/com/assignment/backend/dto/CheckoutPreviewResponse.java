package com.assignment.backend.dto;

import java.math.BigDecimal;

public record CheckoutPreviewResponse(
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String appliedDiscountCode
) {
}
