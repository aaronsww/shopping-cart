package com.assignment.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.DiscountCode;
import com.assignment.backend.repository.DiscountCodeRepository;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
    void givenInvalidManualCode_whenResolveDiscount_thenThrowsFriendlyNotFoundMessage() {
        BigDecimal subtotal = new BigDecimal("100.00");

        when(discountCodeRepository.findByCode("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> discountService.resolveDiscount(subtotal, 1L, "INVALID"))
                .isInstanceOfSatisfying(ResponseStatusException.class, ex -> {
                    assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(ex.getReason()).isEqualTo(DiscountService.notFoundMessage("INVALID"));
                });
    }

    @Test
    void givenInactiveCode_whenResolveDiscount_thenThrowsFriendlyInactiveMessage() {
        BigDecimal subtotal = new BigDecimal("100.00");
        DiscountCode inactiveDiscount = DiscountCode.builder()
                .code("SAVE10")
                .percentage(new BigDecimal("10"))
                .active(false)
                .everyNthOrder(null)
                .build();

        when(discountCodeRepository.findByCode("SAVE10")).thenReturn(Optional.of(inactiveDiscount));

        assertThatThrownBy(() -> discountService.resolveDiscount(subtotal, 1L, "SAVE10"))
                .isInstanceOfSatisfying(ResponseStatusException.class, ex -> {
                    assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(ex.getReason()).isEqualTo(DiscountService.inactiveMessage("SAVE10"));
                });
    }

    @Test
    void givenEligibleNthOrderCode_whenResolveDiscount_thenDiscountIsApplied() {
        BigDecimal subtotal = new BigDecimal("200.00");
        DiscountCode nthOrderDiscount = DiscountCode.builder()
                .code("LOYAL5")
                .percentage(new BigDecimal("15"))
                .active(true)
                .everyNthOrder(5)
                .build();

        when(discountCodeRepository.findByCode("LOYAL5")).thenReturn(Optional.of(nthOrderDiscount));
        when(orderRepository.countByCustomerId(2L)).thenReturn(4L);

        DiscountResult result = discountService.resolveDiscount(subtotal, 2L, "LOYAL5");

        assertThat(result.appliedDiscountCode()).isEqualTo("LOYAL5");
        assertThat(result.discountAmount()).isEqualByComparingTo("30.00");
        assertThat(result.finalAmount()).isEqualByComparingTo("170.00");
    }

    @Test
    void givenNthOrderCodeOnWrongOrder_whenResolveDiscount_thenThrowsFriendlyWrongOrderMessage() {
        BigDecimal subtotal = new BigDecimal("200.00");
        DiscountCode nthOrderDiscount = DiscountCode.builder()
                .code("LOYAL5")
                .percentage(new BigDecimal("15"))
                .active(true)
                .everyNthOrder(5)
                .build();

        when(discountCodeRepository.findByCode("LOYAL5")).thenReturn(Optional.of(nthOrderDiscount));
        when(orderRepository.countByCustomerId(2L)).thenReturn(2L);

        assertThatThrownBy(() -> discountService.resolveDiscount(subtotal, 2L, "LOYAL5"))
                .isInstanceOfSatisfying(ResponseStatusException.class, ex -> {
                    assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(ex.getReason()).isEqualTo(
                            DiscountService.wrongOrderMessage("LOYAL5", 5, 3));
                });
    }

    @Test
    void givenNoDiscountCode_whenResolveDiscount_thenReturnsNone() {
        BigDecimal subtotal = new BigDecimal("50.00");

        DiscountResult result = discountService.resolveDiscount(subtotal, 3L, null);

        assertThat(result).isEqualTo(DiscountResult.none(subtotal));
    }

    @Test
    void givenWhitespaceOnlyCode_whenResolveDiscount_thenReturnsNone() {
        BigDecimal subtotal = new BigDecimal("50.00");

        DiscountResult result = discountService.resolveDiscount(subtotal, 3L, "   ");

        assertThat(result).isEqualTo(DiscountResult.none(subtotal));
    }
}
