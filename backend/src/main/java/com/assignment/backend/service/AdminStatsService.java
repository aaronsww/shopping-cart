package com.assignment.backend.service;

import com.assignment.backend.dto.AdminStatsResponse;
import com.assignment.backend.repository.OrderRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class AdminStatsService {

    private final OrderRepository orderRepository;

    public AdminStatsService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public AdminStatsResponse getStats() {
        Long totalItemsSold = orderRepository.getTotalItemsPurchased();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        BigDecimal totalDiscountsGiven = orderRepository.getTotalDiscountsGiven();

        return new AdminStatsResponse(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                orderRepository.count(),
                totalItemsSold != null ? totalItemsSold : 0L,
                totalDiscountsGiven != null ? totalDiscountsGiven : BigDecimal.ZERO
        );
    }
}
