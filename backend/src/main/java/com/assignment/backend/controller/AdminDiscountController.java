package com.assignment.backend.controller;

import com.assignment.backend.config.AdminAuth;
import com.assignment.backend.entity.DiscountCode;
import com.assignment.backend.repository.DiscountCodeRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/discounts")
public class AdminDiscountController {

    private final DiscountCodeRepository discountCodeRepository;

    public AdminDiscountController(DiscountCodeRepository discountCodeRepository) {
        this.discountCodeRepository = discountCodeRepository;
    }

    @PostMapping
    public DiscountCode createDiscountCode(
            @RequestHeader(value = AdminAuth.HEADER, required = false) String adminKey,
            @RequestBody CreateDiscountRequest request
    ) {
        AdminAuth.validate(adminKey);

        if (request.code() == null || request.code().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Code must not be empty");
        }

        if (request.percentage() == null || request.percentage().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Percentage must be greater than zero");
        }

        if (request.everyNthOrder() != null && request.everyNthOrder() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "everyNthOrder must be greater than zero");
        }

        DiscountCode discountCode = DiscountCode.builder()
                .code(request.code().trim())
                .percentage(request.percentage())
                .everyNthOrder(request.everyNthOrder())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return discountCodeRepository.save(discountCode);
    }

    @GetMapping
    public List<DiscountCode> listDiscountCodes(
            @RequestHeader(value = AdminAuth.HEADER, required = false) String adminKey
    ) {
        AdminAuth.validate(adminKey);
        return discountCodeRepository.findAll();
    }

    @PutMapping("/deactivate/{code}")
    public DiscountCode deactivateDiscountCode(
            @RequestHeader(value = AdminAuth.HEADER, required = false) String adminKey,
            @PathVariable String code
    ) {
        AdminAuth.validate(adminKey);

        DiscountCode discountCode = findDiscountCodeOrThrow(code);

        if (!discountCode.isActive()) {
            return discountCode;
        }

        discountCode.setActive(false);
        return discountCodeRepository.save(discountCode);
    }

    @PutMapping("/activate/{code}")
    public DiscountCode activateDiscountCode(
            @RequestHeader(value = AdminAuth.HEADER, required = false) String adminKey,
            @PathVariable String code
    ) {
        AdminAuth.validate(adminKey);

        DiscountCode discountCode = findDiscountCodeOrThrow(code);

        if (discountCode.isActive()) {
            return discountCode;
        }

        discountCode.setActive(true);
        return discountCodeRepository.save(discountCode);
    }

    private DiscountCode findDiscountCodeOrThrow(String code) {
        return discountCodeRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Discount code not found: " + code
                ));
    }

    public record CreateDiscountRequest(String code, BigDecimal percentage, Integer everyNthOrder) {
    }
}
