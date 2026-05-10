package com.estore.shopping.controller;

import com.estore.shopping.dto.AddToCartRequest;
import com.estore.shopping.dto.CartResponse;
import com.estore.shopping.dto.UpdateCartItemRequest;
import com.estore.shopping.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> add(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.add(request));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> update(@Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.update(request));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> remove(@PathVariable long itemId) {
        cartService.remove(itemId);
        return ResponseEntity.noContent().build();
    }
}
