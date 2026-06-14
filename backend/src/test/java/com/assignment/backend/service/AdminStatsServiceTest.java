package com.assignment.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.assignment.backend.dto.DiscountUsageStats;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminStatsServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private AdminStatsService adminStatsService;

    @Test
    void givenOrdersWithDiscounts_whenGetStats_thenReturnsDiscountUsageBreakdown() {
        when(orderRepository.getTotalItemsPurchased()).thenReturn(12L);
        when(orderRepository.getTotalRevenue()).thenReturn(new BigDecimal("500.00"));
        when(orderRepository.getTotalDiscountsGiven()).thenReturn(new BigDecimal("45.00"));
        when(orderRepository.count()).thenReturn(8L);
        when(orderRepository.getDiscountUsageStats()).thenReturn(List.of(
                new DiscountUsageStats("SAVE10", new BigDecimal("30.00"), 3L),
                new DiscountUsageStats("LOYAL5", new BigDecimal("15.00"), 1L)
        ));

        var stats = adminStatsService.getStats();

        assertThat(stats.totalRevenue()).isEqualByComparingTo("500.00");
        assertThat(stats.totalOrders()).isEqualTo(8L);
        assertThat(stats.totalItemsSold()).isEqualTo(12L);
        assertThat(stats.totalDiscountsGiven()).isEqualByComparingTo("45.00");
        assertThat(stats.discountUsage()).containsExactly(
                new DiscountUsageStats("SAVE10", new BigDecimal("30.00"), 3L),
                new DiscountUsageStats("LOYAL5", new BigDecimal("15.00"), 1L)
        );
    }
}
