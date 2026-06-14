package com.assignment.backend.repository;

import com.assignment.backend.entity.Order;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    long countByCustomerId(Long customerId);

    @Query("SELECT COALESCE(SUM(o.itemCount), 0) FROM Order o")
    Long getTotalItemsPurchased();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM Order o")
    BigDecimal getTotalDiscountsGiven();
}
