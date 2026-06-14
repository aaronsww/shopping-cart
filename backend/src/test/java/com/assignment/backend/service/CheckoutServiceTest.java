package com.assignment.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.assignment.backend.dto.CheckoutResponse;
import com.assignment.backend.dto.DiscountResult;
import com.assignment.backend.entity.Cart;
import com.assignment.backend.entity.CartItem;
import com.assignment.backend.entity.Order;
import com.assignment.backend.entity.Product;
import com.assignment.backend.repository.CartItemRepository;
import com.assignment.backend.repository.CartRepository;
import com.assignment.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private DiscountService discountService;

    @InjectMocks
    private CheckoutService checkoutService;

    @Test
    void givenCartWithItems_whenCheckoutConfirm_thenOrderIsSavedAndCartIsCleared() {
        Long customerId = 1L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();
        Product product = Product.builder().id(1L).title("Widget").price(new BigDecimal("25.00")).build();
        CartItem cartItem = CartItem.builder().cart(cart).product(product).quantity(2).build();
        DiscountResult discount = DiscountResult.none(new BigDecimal("50.00"));
        Order savedOrder = Order.builder()
                .id(99L)
                .customerId(customerId)
                .subtotal(new BigDecimal("50.00"))
                .discountAmount(BigDecimal.ZERO)
                .total(new BigDecimal("50.00"))
                .itemCount(2)
                .build();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(cartItem));
        when(discountService.resolveDiscount(new BigDecimal("50.00"), customerId, null))
                .thenReturn(discount);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        CheckoutResponse response = checkoutService.checkoutConfirm(customerId, null);

        assertThat(response.orderId()).isEqualTo(99L);
        verify(orderRepository).save(any(Order.class));
        verify(cartItemRepository).deleteByCartId(10L);
    }

    @Test
    void givenEmptyCart_whenCheckoutConfirm_thenThrowsIllegalStateException() {
        Long customerId = 1L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of());

        assertThatThrownBy(() -> checkoutService.checkoutConfirm(customerId, null))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cart is empty");
    }

    @Test
    void givenMissingCart_whenCheckoutConfirm_thenThrowsEntityNotFoundException() {
        Long customerId = 1L;

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkoutService.checkoutConfirm(customerId, null))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Cart not found for customer: " + customerId);
    }

    @Test
    void givenDiscountApplied_whenCheckoutConfirm_thenOrderPersistsDiscountAndTotal() {
        Long customerId = 1L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();
        Product product = Product.builder().id(1L).title("Widget").price(new BigDecimal("100.00")).build();
        CartItem cartItem = CartItem.builder().cart(cart).product(product).quantity(1).build();
        DiscountResult discount = new DiscountResult(
                new BigDecimal("20.00"),
                new BigDecimal("80.00"),
                "SAVE20");

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(cartItem));
        when(discountService.resolveDiscount(new BigDecimal("100.00"), customerId, "SAVE20"))
                .thenReturn(discount);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(42L);
            return order;
        });
        when(discountService.findByCode("SAVE20")).thenReturn(Optional.empty());

        checkoutService.checkoutConfirm(customerId, "SAVE20");

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());

        Order savedOrder = orderCaptor.getValue();
        assertThat(savedOrder.getSubtotal()).isEqualByComparingTo("100.00");
        assertThat(savedOrder.getDiscountAmount()).isEqualByComparingTo("20.00");
        assertThat(savedOrder.getTotal()).isEqualByComparingTo("80.00");
        assertThat(savedOrder.getItemCount()).isEqualTo(1);
    }
}
