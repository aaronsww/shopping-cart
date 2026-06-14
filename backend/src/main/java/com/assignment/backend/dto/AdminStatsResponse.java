package com.assignment.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminStatsResponse(
        BigDecimal totalRevenue,
        Long totalOrders,
        Long totalItemsSold,
        BigDecimal totalDiscountsGiven,
        List<DiscountUsageStats> discountUsage
) {
}
