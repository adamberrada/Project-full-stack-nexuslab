package com.estore.catalog.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estore.catalog.dto.ProductSummaryResponse;
import com.estore.catalog.service.CatalogService;

@RestController
public class BrowserCatalogController {

    private final CatalogService catalogService;

    public BrowserCatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/")
    public ResponseEntity<Void> home() {
        return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", "/catalog")
                .build();
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<ProductSummaryResponse>> catalog() {
        return ResponseEntity.ok(catalogService.listProducts(null, null));
    }
}