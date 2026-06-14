package com.assignment.backend.dto;

public record CheckoutRequest(
        Long customerId,
        String discountCode
) {
}
