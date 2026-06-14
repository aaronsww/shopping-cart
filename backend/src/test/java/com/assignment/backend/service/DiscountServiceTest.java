package com.assignment.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.DiscountCode;
import com.assignment.backend.repository.DiscountCodeRepository;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DiscountServiceTest {

    @Mock
    private DiscountCodeRepository discountCodeRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private DiscountService discountService;

    @Test
    void givenValidManualCode_whenResolveDiscount_thenDiscountIsApplied() {
        BigDecimal subtotal = new BigDecimal("100.00");
        DiscountCode manualDiscount = DiscountCode.builder()
                .code("SAVE10")
                .percentage(new BigDecimal("10"))
                .active(true)
                .everyNthOrder(null)
                .build();

        when(discountCodeRepository.findByCode("SAVE10")).thenReturn(Optional.of(manualDiscount));

        DiscountResult result = discountService.resolveDiscount(subtotal, 1L, "SAVE10");

        assertThat(result.appliedDiscountCode()).isEqualTo("SAVE10");
        assertThat(result.discountAmount()).isEqualByComparingTo("10.00");
        assertThat(result.finalAmount()).isEqualByComparingTo("90.00");
    }

    @Test
    void givenInvalidManualCode_whenResolveDiscount_thenNoDiscountIsApplied() {
        BigDecimal subtotal = new BigDecimal("100.00");

        when(discountCodeRepository.findByCode("INVALID")).thenReturn(Optional.empty());
        when(orderRepository.countByCustomerId(1L)).thenReturn(0L);
        when(discountCodeRepository.findByActiveTrueAndEveryNthOrderIsNotNull()).thenReturn(List.of());

        DiscountResult result = discountService.resolveDiscount(subtotal, 1L, "INVALID");

        assertThat(result).isEqualTo(DiscountResult.none(subtotal));
    }

    @Test
    void givenEligibleNthOrder_whenResolveDiscount_thenNthOrderDiscountIsApplied() {
        BigDecimal subtotal = new BigDecimal("200.00");
        DiscountCode nthOrderDiscount = DiscountCode.builder()
                .code("LOYAL5")
                .percentage(new BigDecimal("15"))
                .active(true)
                .everyNthOrder(5)
                .build();

        when(orderRepository.countByCustomerId(2L)).thenReturn(4L);
        when(discountCodeRepository.findByActiveTrueAndEveryNthOrderIsNotNull())
                .thenReturn(List.of(nthOrderDiscount));

        DiscountResult result = discountService.resolveDiscount(subtotal, 2L, null);

        assertThat(result.appliedDiscountCode()).isEqualTo("LOYAL5");
        assertThat(result.discountAmount()).isEqualByComparingTo("30.00");
        assertThat(result.finalAmount()).isEqualByComparingTo("170.00");
    }

    @Test
    void givenNoEligibleDiscounts_whenResolveDiscount_thenReturnsNone() {
        BigDecimal subtotal = new BigDecimal("50.00");

        when(orderRepository.countByCustomerId(3L)).thenReturn(2L);
        when(discountCodeRepository.findByActiveTrueAndEveryNthOrderIsNotNull()).thenReturn(List.of());

        DiscountResult result = discountService.resolveDiscount(subtotal, 3L, null);

        assertThat(result).isEqualTo(DiscountResult.none(subtotal));
    }
}
