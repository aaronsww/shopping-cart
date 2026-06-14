package com.assignment.backend.dto;

public record AddToCartRequest(
        Long customerId,
        Long productId,
        int quantity
) {
}
