package com.assignment.backend.controller;

import com.assignment.backend.dto.CheckoutPreviewResponse;
import com.assignment.backend.dto.CheckoutRequest;
import com.assignment.backend.dto.CheckoutResponse;
import com.assignment.backend.service.CheckoutService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/preview")
    public CheckoutPreviewResponse checkoutPreview(@RequestBody CheckoutRequest request) {
        return checkoutService.checkoutPreview(request.customerId(), request.discountCode());
    }

    @PostMapping("/confirm")
    public CheckoutResponse checkoutConfirm(@RequestBody CheckoutRequest request) {
        return checkoutService.checkoutConfirm(request.customerId(), request.discountCode());
    }
}
