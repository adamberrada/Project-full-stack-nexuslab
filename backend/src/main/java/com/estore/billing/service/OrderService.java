package com.estore.billing.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estore.billing.dto.OrderItemResponse;
import com.estore.billing.dto.OrderResponse;
import com.estore.billing.dto.PlaceOrderRequest;
import com.estore.billing.entity.Order;
import com.estore.billing.entity.OrderItem;
import com.estore.billing.entity.OrderStatus;
import com.estore.billing.repository.OrderRepository;
import com.estore.customer.entity.User;
import com.estore.customer.service.CustomerService;
import com.estore.exception.BadRequestException;
import com.estore.exception.NotFoundException;
import com.estore.inventory.service.InventoryService;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.entity.CartItem;
import com.estore.shopping.service.CartService;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final CartService cartService;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository,
                        CustomerService customerService,
                        CartService cartService,
                        InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.cartService = cartService;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        User user = customerService.getUserEntity(request.userId());
        Cart cart = cartService.getOrCreateCartEntity(user.getId());

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Stock check first
        for (CartItem cartItem : cart.getItems()) {
            inventoryService.ensureAvailable(cartItem.getProduct().getId(), cartItem.getQuantity());
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CONFIRMED);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setUnitPrice(cartItem.getUnitPrice());
            item.setQuantity(cartItem.getQuantity());
            order.getItems().add(item);

            total = total.add(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        order.setTotalAmount(total);

        // Decrease stock
        for (CartItem cartItem : cart.getItems()) {
            inventoryService.decrease(cartItem.getProduct().getId(), cartItem.getQuantity());
        }

        Order saved = orderRepository.save(order);
        cartService.clearCart(cart);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listByUser(long userId) {
        customerService.getUserEntity(userId);
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void validateOrder(long userId, long orderId) {
        customerService.getUserEntity(userId);

        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        orderRepository.deleteById(Objects.requireNonNull(order.getId()));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(oi -> {
            BigDecimal lineTotal = oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity()));
            return new OrderItemResponse(
                    oi.getId(),
                    oi.getProduct().getId(),
                    oi.getProduct().getName(),
                    oi.getUnitPrice(),
                    oi.getQuantity(),
                    lineTotal
            );
        }).toList();

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                items
        );
    }
}
