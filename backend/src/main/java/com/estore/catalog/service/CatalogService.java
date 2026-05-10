package com.estore.catalog.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.estore.catalog.dto.CategoryResponse;
import com.estore.catalog.dto.ProductDetailResponse;
import com.estore.catalog.dto.ProductSummaryResponse;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.NotFoundException;

@Service
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public CatalogService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> listProducts(String q, Long categoryId) {
        List<Product> products;
        String query = q == null ? null : q.trim();
        boolean hasQuery = query != null && !query.isBlank();

        if (hasQuery && categoryId != null) {
            products = productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, query);
        } else if (hasQuery) {
            products = productRepository.findByNameContainingIgnoreCase(query);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findAll();
        }
        return products.stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProduct(long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return toDetail(product);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAll().stream().map(this::toCategory).toList();
    }

    private ProductSummaryResponse toSummary(Product p) {
        return new ProductSummaryResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getImageUrl(),
                toCategory(p.getCategory()),
                p.getInventory() == null ? 0 : p.getInventory().getQuantity()
        );
    }

    private ProductDetailResponse toDetail(Product p) {
        return new ProductDetailResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getImageUrl(),
                p.getDescription(),
                toCategory(p.getCategory()),
                p.getInventory() == null ? 0 : p.getInventory().getQuantity()
        );
    }

    private CategoryResponse toCategory(Category c) {
        if (c == null) {
            return null;
        }
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}
