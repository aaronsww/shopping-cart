package com.assignment.backend.controller;

import com.assignment.backend.config.AdminAuth;
import com.assignment.backend.dto.AdminStatsResponse;
import com.assignment.backend.service.AdminStatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    public AdminStatsController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    @GetMapping
    public AdminStatsResponse getStats(
            @RequestHeader(value = AdminAuth.HEADER, required = false) String adminKey) {
        AdminAuth.validate(adminKey);
        return adminStatsService.getStats();
    }
}
