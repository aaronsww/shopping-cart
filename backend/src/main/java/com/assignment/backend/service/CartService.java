package com.assignment.backend.service;

import com.assignment.backend.dto.CartItemDto;
import com.assignment.backend.dto.CartResponseDto;
import com.assignment.backend.entity.Cart;
import com.assignment.backend.entity.CartItem;
import com.assignment.backend.entity.Product;
import com.assignment.backend.repository.CartItemRepository;
import com.assignment.backend.repository.CartRepository;
import com.assignment.backend.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CartResponseDto addToCart(Long customerId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));

        Cart cart = findOrCreateCart(customerId);

        cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresentOrElse(
                        existingItem -> {
                            existingItem.setQuantity(existingItem.getQuantity() + quantity);
                            cartItemRepository.save(existingItem);
                        },
                        () -> cartItemRepository.save(
                                CartItem.builder()
                                        .cart(cart)
                                        .product(product)
                                        .quantity(quantity)
                                        .build()
                        )
                );

        return buildCartResponse(cart);
    }

    @Transactional(readOnly = true)
    public CartResponseDto getCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .map(this::buildCartResponse)
                .orElseGet(() -> new CartResponseDto(null, customerId, List.of(), BigDecimal.ZERO));
    }

    @Transactional
    public void removeItem(Long customerId, Long productId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for customer: " + customerId));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cart item not found for product: " + productId
                ));

        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            cartItemRepository.save(cartItem);
        } else {
            cartItemRepository.delete(cartItem);
        }
    }

    @Transactional
    public void clearCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for customer: " + customerId));

        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart findOrCreateCart(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    try {
                        return cartRepository.save(
                                Cart.builder().customerId(customerId).build()
                        );
                    } catch (DataIntegrityViolationException ex) {
                        return cartRepository.findByCustomerId(customerId)
                                .orElseThrow(() -> ex);
                    }
                });
    }

    private CartResponseDto buildCartResponse(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        List<CartItemDto> items = cartItems.stream()
                .map(item -> new CartItemDto(
                        item.getProduct().getId(),
                        item.getProduct().getTitle(),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();

        BigDecimal total = items.stream()
                .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponseDto(cart.getId(), cart.getCustomerId(), items, total);
    }
}
