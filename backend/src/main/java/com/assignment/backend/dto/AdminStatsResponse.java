package com.assignment.backend.dto;

import java.math.BigDecimal;

public record AdminStatsResponse(
        BigDecimal totalRevenue,
        Long totalOrders,
        Long totalItemsSold,
        BigDecimal totalDiscountsGiven
) {
}
