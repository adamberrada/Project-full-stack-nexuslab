package com.estore.billing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.estore.billing.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product", "items.product.category"})
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
}
