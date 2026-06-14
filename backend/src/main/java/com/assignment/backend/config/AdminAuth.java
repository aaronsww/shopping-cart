package com.assignment.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class AdminAuth {

    public static final String KEY = "secret123";
    public static final String HEADER = "X-ADMIN-KEY";

    private AdminAuth() {
    }

    public static void validate(String adminKey) {
        if (!KEY.equals(adminKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}
