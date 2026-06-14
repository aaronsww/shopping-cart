package com.assignment.backend.service;

import com.assignment.backend.dto.CheckoutPreviewResponse;
import com.assignment.backend.dto.CheckoutResponse;
import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.Cart;
import com.assignment.backend.entity.CartItem;
import com.assignment.backend.entity.Order;
import com.assignment.backend.repository.CartItemRepository;
import com.assignment.backend.repository.CartRepository;
import com.assignment.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final OrderRepository orderRepository;
        private final DiscountService discountService;

        public CheckoutService(
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        DiscountService discountService) {
                this.cartRepository = cartRepository;
                this.cartItemRepository = cartItemRepository;
                this.orderRepository = orderRepository;
                this.discountService = discountService;
        }

        @Transactional(readOnly = true)
        public CheckoutPreviewResponse checkoutPreview(Long customerId, String discountCode) {
                CartCheckoutContext context = loadCartCheckoutContext(customerId);
                DiscountResult discount = discountService.resolveDiscount(
                                context.subtotal(),
                                customerId,
                                discountCode);

                return new CheckoutPreviewResponse(
                                context.subtotal(),
                                discount.discountAmount(),
                                discount.finalAmount(),
                                discount.appliedDiscountCode());
        }

        @Transactional
        public CheckoutResponse checkoutConfirm(Long customerId, String discountCode) {
                CartCheckoutContext context = loadCartCheckoutContext(customerId);
                DiscountResult discount = discountService.resolveDiscount(
                                context.subtotal(),
                                customerId,
                                discountCode);

                Order order = orderRepository.save(
                                Order.builder()
                                                .customerId(customerId)
                                                .subtotal(context.subtotal())
                                                .discountAmount(discount.discountAmount())
                                                .total(discount.finalAmount())
                                                .itemCount(context.itemCount())
                                                .createdAt(LocalDateTime.now())
                                                .build());

                cartItemRepository.deleteByCartId(context.cart().getId());

                String couponCode = resolveRewardCoupon(discount.appliedDiscountCode(), order.getId());

                return new CheckoutResponse(
                                order.getId(),
                                context.subtotal(),
                                discount.discountAmount(),
                                discount.finalAmount(),
                                couponCode);
        }

        private CartCheckoutContext loadCartCheckoutContext(Long customerId) {
                Cart cart = cartRepository.findByCustomerId(customerId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Cart not found for customer: " + customerId));

                List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
                if (cartItems.isEmpty()) {
                        throw new IllegalStateException("Cart is empty");
                }

                BigDecimal subtotal = cartItems.stream()
                                .map(item -> item.getProduct().getPrice()
                                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                int itemCount = cartItems.stream()
                                .mapToInt(CartItem::getQuantity)
                                .sum();

                return new CartCheckoutContext(cart, subtotal, itemCount);
        }

        private String resolveRewardCoupon(String appliedDiscountCode, Long orderId) {
                if (appliedDiscountCode == null) {
                        return null;
                }

                return discountService.findByCode(appliedDiscountCode)
                                .filter(discountService::isNthOrderDiscount)
                                .map(code -> appliedDiscountCode + "_" + orderId)
                                .orElse(null);
        }

        private record CartCheckoutContext(Cart cart, BigDecimal subtotal, int itemCount) {
        }
}
