package com.assignment.backend.dto;

import java.math.BigDecimal;

public record CheckoutResponse(
        Long orderId,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String couponCode
) {
}
