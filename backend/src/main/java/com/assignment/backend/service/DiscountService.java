package com.assignment.backend.service;

import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.DiscountCode;
import com.assignment.backend.repository.DiscountCodeRepository;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DiscountService {

    private final DiscountCodeRepository discountCodeRepository;
    private final OrderRepository orderRepository;

    public DiscountService(
            DiscountCodeRepository discountCodeRepository,
            OrderRepository orderRepository) {
        this.discountCodeRepository = discountCodeRepository;
        this.orderRepository = orderRepository;
    }

    public DiscountResult resolveDiscount(BigDecimal subtotal, Long customerId, String discountCode) {
        if (discountCode == null || discountCode.isBlank()) {
            return DiscountResult.none(subtotal);
        }

        String trimmedCode = discountCode.trim();
        DiscountCode discount = discountCodeRepository.findByCode(trimmedCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        notFoundMessage(trimmedCode)));

        if (!discount.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    inactiveMessage(trimmedCode));
        }

        if (discount.getEveryNthOrder() != null) {
            long nextOrderNumber = orderRepository.countByCustomerId(customerId) + 1;
            if (nextOrderNumber % discount.getEveryNthOrder() != 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        wrongOrderMessage(trimmedCode, discount.getEveryNthOrder(), nextOrderNumber));
            }
        }

        return applyDiscount(subtotal, discount);
    }

    static String notFoundMessage(String code) {
        return "We couldn't find a discount code matching \"" + code
                + "\". Please check the spelling and try again.";
    }

    static String inactiveMessage(String code) {
        return "\"" + code + "\" is no longer active. It may have expired or been deactivated.";
    }

    static String wrongOrderMessage(String code, int everyNthOrder, long nextOrderNumber) {
        return "\"" + code + "\" is not eligible.";
    }

    public DiscountResult applyDiscount(BigDecimal subtotal, DiscountCode discountCode) {
        BigDecimal finalAmount = calculateFinalAmount(subtotal, discountCode.getPercentage());
        BigDecimal discountAmount = subtotal.subtract(finalAmount);
        return new DiscountResult(discountAmount, finalAmount, discountCode.getCode());
    }

    public BigDecimal calculateFinalAmount(BigDecimal total, BigDecimal percentage) {
        BigDecimal discountAmount = total
                .multiply(percentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return total.subtract(discountAmount);
    }

    public boolean isNthOrderDiscount(DiscountCode discountCode) {
        return discountCode != null && discountCode.getEveryNthOrder() != null;
    }

    public Optional<DiscountCode> findByCode(String code) {
        return discountCodeRepository.findByCode(code);
    }
}
