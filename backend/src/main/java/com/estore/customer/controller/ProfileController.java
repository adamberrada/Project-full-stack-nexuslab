package com.estore.customer.controller;

import com.estore.customer.dto.ProfileResponse;
import com.estore.customer.dto.UpdateProfileRequest;
import com.estore.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private final CustomerService customerService;

    public ProfileController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable long userId) {
        return ResponseEntity.ok(customerService.getProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ProfileResponse> updateProfile(@PathVariable long userId, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(customerService.updateProfile(userId, request));
    }
}
