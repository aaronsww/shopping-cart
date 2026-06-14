package com.assignment.backend.service;

import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.DiscountCode;
import com.assignment.backend.repository.DiscountCodeRepository;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.Optional;
import org.springframework.stereotype.Service;

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

    public boolean isValidManualCode(String code) {
        return findValidManualCode(code).isPresent();
    }

    // for future, in case we want to support manual additions
    public Optional<DiscountCode> findValidManualCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }

        return discountCodeRepository.findByCode(code.trim())
                .filter(DiscountCode::isActive)
                .filter(discount -> discount.getEveryNthOrder() == null);
    }

    public Optional<DiscountCode> findEligibleNthOrderDiscount(Long customerId) {
        long nextOrderNumber = orderRepository.countByCustomerId(customerId) + 1;

        return discountCodeRepository.findByActiveTrueAndEveryNthOrderIsNotNull().stream()
                .filter(discount -> nextOrderNumber % discount.getEveryNthOrder() == 0)
                .max(Comparator.comparing(DiscountCode::getPercentage));
    }

    public DiscountResult resolveDiscount(BigDecimal subtotal, Long customerId, String manualCode) {
        Optional<DiscountCode> manualDiscount = findValidManualCode(manualCode);
        if (manualDiscount.isPresent()) {
            return applyDiscount(subtotal, manualDiscount.get());
        }

        // for the nth discount code of that particular customer 
        Optional<DiscountCode> nthOrderDiscount = findEligibleNthOrderDiscount(customerId);
        if (nthOrderDiscount.isPresent()) {
            return applyDiscount(subtotal, nthOrderDiscount.get());
        }

        return DiscountResult.none(subtotal);
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
