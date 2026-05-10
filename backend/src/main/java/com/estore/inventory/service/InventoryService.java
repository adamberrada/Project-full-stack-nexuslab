package com.estore.inventory.service;

import com.estore.exception.InsufficientStockException;
import com.estore.exception.NotFoundException;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public int getAvailableQuantity(long productId) {
        return inventoryRepository.findByProductId(productId)
                .map(Inventory::getQuantity)
                .orElse(0);
    }

    @Transactional
    public void ensureAvailable(long productId, int requestedQuantity) {
        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Inventory not found for product"));
        if (requestedQuantity > inv.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock");
        }
    }

    @Transactional
    public void decrease(long productId, int quantity) {
        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new NotFoundException("Inventory not found for product"));
        if (quantity > inv.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock");
        }
        inv.setQuantity(inv.getQuantity() - quantity);
        inventoryRepository.save(inv);
    }
}
