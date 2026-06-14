package com.assignment.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.assignment.backend.dto.CartResponseDto;
import com.assignment.backend.entity.Cart;
import com.assignment.backend.entity.CartItem;
import com.assignment.backend.entity.Product;
import com.assignment.backend.repository.CartItemRepository;
import com.assignment.backend.repository.CartRepository;
import com.assignment.backend.repository.ProductRepository;
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
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void givenNewProduct_whenAddToCart_thenCartItemIsCreated() {
        Long customerId = 1L;
        Long productId = 5L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();
        Product product = Product.builder().id(productId).title("Gadget").price(new BigDecimal("15.00")).build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdAndProductId(10L, productId)).thenReturn(Optional.empty());
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(
                CartItem.builder().cart(cart).product(product).quantity(2).build()));

        CartResponseDto response = cartService.addToCart(customerId, productId, 2);

        ArgumentCaptor<CartItem> itemCaptor = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(itemCaptor.capture());

        CartItem savedItem = itemCaptor.getValue();
        assertThat(savedItem.getCart()).isEqualTo(cart);
        assertThat(savedItem.getProduct()).isEqualTo(product);
        assertThat(savedItem.getQuantity()).isEqualTo(2);
        assertThat(response.items()).hasSize(1);
        assertThat(response.total()).isEqualByComparingTo("30.00");
    }

    @Test
    void givenExistingProduct_whenAddToCart_thenQuantityIsIncremented() {
        Long customerId = 1L;
        Long productId = 5L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();
        Product product = Product.builder().id(productId).title("Gadget").price(new BigDecimal("15.00")).build();
        CartItem existingItem = CartItem.builder().cart(cart).product(product).quantity(2).build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdAndProductId(10L, productId)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(existingItem));

        cartService.addToCart(customerId, productId, 3);

        assertThat(existingItem.getQuantity()).isEqualTo(5);
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    void givenSingleQuantityItem_whenRemoveItem_thenItemIsDeleted() {
        Long customerId = 1L;
        Long productId = 5L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();
        Product product = Product.builder().id(productId).title("Gadget").price(new BigDecimal("15.00")).build();
        CartItem cartItem = CartItem.builder().id(20L).cart(cart).product(product).quantity(1).build();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdAndProductId(10L, productId)).thenReturn(Optional.of(cartItem));

        cartService.removeItem(customerId, productId);

        verify(cartItemRepository).delete(cartItem);
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void givenCartWithItems_whenClearCart_thenAllItemsAreRemoved() {
        Long customerId = 1L;
        Cart cart = Cart.builder().id(10L).customerId(customerId).build();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));

        cartService.clearCart(customerId);

        verify(cartItemRepository).deleteByCartId(10L);
    }

    @Test
    void givenNonPositiveQuantity_whenAddToCart_thenThrowsIllegalArgumentException() {
        assertThatThrownBy(() -> cartService.addToCart(1L, 5L, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Quantity must be greater than zero");

        assertThatThrownBy(() -> cartService.addToCart(1L, 5L, -1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Quantity must be greater than zero");
    }
}
