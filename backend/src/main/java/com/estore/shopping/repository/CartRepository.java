package com.estore.shopping.repository;

import com.estore.shopping.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {"items", "items.product", "items.product.category", "items.product.inventory"})
    Optional<Cart> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
