package com.assignment.backend.controller;

import com.assignment.backend.dto.AddToCartRequest;
import com.assignment.backend.dto.CartResponseDto;
import com.assignment.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{customerId}")
    public CartResponseDto getCart(@PathVariable Long customerId) {
        return cartService.getCart(customerId);
    }

    @PostMapping("/add")
    public CartResponseDto addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addToCart(
                request.customerId(),
                request.productId(),
                request.quantity());
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeItem(
            @RequestParam Long customerId,
            @RequestParam Long productId) {
        cartService.removeItem(customerId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }
}
