package com.estore.catalog.controller;

import com.estore.catalog.dto.CategoryResponse;
import com.estore.catalog.dto.ProductDetailResponse;
import com.estore.catalog.dto.ProductSummaryResponse;
import com.estore.catalog.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductSummaryResponse>> listProducts(
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "categoryId") Long categoryId
    ) {
        return ResponseEntity.ok(catalogService.listProducts(q, categoryId));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDetailResponse> getProduct(@PathVariable long id) {
        return ResponseEntity.ok(catalogService.getProduct(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> listCategories() {
        return ResponseEntity.ok(catalogService.listCategories());
    }
}
