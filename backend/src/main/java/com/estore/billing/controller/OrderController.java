package com.estore.billing.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estore.billing.dto.OrderResponse;
import com.estore.billing.dto.PlaceOrderRequest;
import com.estore.billing.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> listByUser(@PathVariable long userId) {
        return ResponseEntity.ok(orderService.listByUser(userId));
    }

    @PutMapping("/{orderId}/validate")
    public ResponseEntity<Void> validateOrder(@PathVariable long orderId,
                                              @RequestParam long userId) {
        orderService.validateOrder(userId, orderId);
        return ResponseEntity.noContent().build();
    }
}
