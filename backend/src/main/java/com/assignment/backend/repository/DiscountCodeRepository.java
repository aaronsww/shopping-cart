package com.assignment.backend.repository;

import com.assignment.backend.entity.DiscountCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountCodeRepository extends JpaRepository<DiscountCode, Long> {

    Optional<DiscountCode> findByCode(String code);

    List<DiscountCode> findByActiveTrueAndEveryNthOrderIsNotNull();
}
