package com.estore.shopping.service;

import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.User;
import com.estore.customer.service.CustomerService;
import com.estore.exception.NotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shopping.dto.*;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.repository.CartItemRepository;
import com.estore.shopping.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerService customerService;
    private final InventoryService inventoryService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       CustomerService customerService,
                       InventoryService inventoryService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customerService = customerService;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public CartResponse getCart(long userId) {
        Cart cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse add(AddToCartRequest request) {
        Cart cart = getOrCreateCart(request.userId());
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        int newQuantity = request.quantity();
        if (item != null) {
            newQuantity = item.getQuantity() + request.quantity();
        }

        inventoryService.ensureAvailable(product.getId(), newQuantity);

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            item.setQuantity(request.quantity());
            cart.getItems().add(item);
        } else {
            item.setQuantity(newQuantity);
        }

        cartRepository.save(cart);
        return toResponse(cartRepository.findFirstByUserIdOrderByCreatedAtDesc(request.userId()).orElse(cart));
    }

    @Transactional
    public CartResponse update(UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(request.itemId())
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        inventoryService.ensureAvailable(item.getProduct().getId(), request.quantity());

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        Long userId = item.getCart().getUser().getId();
        Cart cart = cartRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));
        return toResponse(cart);
    }

    @Transactional
    public void remove(long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public Cart getOrCreateCartEntity(long userId) {
        return cartRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseGet(() -> {
                    User user = customerService.getUserEntity(userId);
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    private Cart getOrCreateCart(long userId) {
        return getOrCreateCartEntity(userId);
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .sorted(Comparator.comparing(CartItem::getId, Comparator.nullsLast(Long::compareTo)))
                .map(this::toItem)
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), cart.getUser().getId(), items, total);
    }

    private CartItemResponse toItem(CartItem item) {
        BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        int available = item.getProduct().getInventory() == null ? 0 : item.getProduct().getInventory().getQuantity();
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getUnitPrice(),
                item.getQuantity(),
                lineTotal,
                available
        );
    }
}
