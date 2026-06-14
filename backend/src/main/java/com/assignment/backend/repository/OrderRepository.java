package com.assignment.backend.repository;

import com.assignment.backend.dto.DiscountUsageStats;
import com.assignment.backend.entity.Order;
import java.math.BigDecimal;
import java.util.List;
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

    @Query("""
            SELECT new com.assignment.backend.dto.DiscountUsageStats(
                o.appliedDiscountCode,
                SUM(o.discountAmount),
                COUNT(o)
            )
            FROM Order o
            WHERE o.appliedDiscountCode IS NOT NULL
            GROUP BY o.appliedDiscountCode
            ORDER BY SUM(o.discountAmount) DESC
            """)
    List<DiscountUsageStats> getDiscountUsageStats();
}
