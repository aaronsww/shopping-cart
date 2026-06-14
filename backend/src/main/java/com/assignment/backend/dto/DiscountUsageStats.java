package com.assignment.backend.dto;

import java.math.BigDecimal;

public record DiscountUsageStats(
        String code,
        BigDecimal totalDiscount,
        Long usageCount
) {
}
