package com.estore.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.estore.catalog.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category", "inventory"})
    List<Product> findByNameContainingIgnoreCase(String name);

    @EntityGraph(attributePaths = {"category", "inventory"})
    List<Product> findByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = {"category", "inventory"})
    List<Product> findByCategoryIdAndNameContainingIgnoreCase(Long categoryId, String name);

    @Override
    @EntityGraph(attributePaths = {"category", "inventory"})
    List<Product> findAll();
}
