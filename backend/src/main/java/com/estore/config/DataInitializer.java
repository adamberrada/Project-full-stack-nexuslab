package com.estore.config;

import java.math.BigDecimal;
import java.util.Objects;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.Profile;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.inventory.entity.Inventory;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(CategoryRepository categoryRepository,
                                      ProductRepository productRepository,
                                      UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            
            Category horror = upsertCategory(categoryRepository, "Horror", "HORROR COLLECTION");
            Category fantasy = upsertCategory(categoryRepository, "Fantasy", "FANTASY & RPG");
            Category racing = upsertCategory(categoryRepository, "Racing", "RACING & SPEED");
            Category scifi = upsertCategory(categoryRepository, "Scifi", "SCI-FI & SPACE");
            Category retro = upsertCategory(categoryRepository, "Retro", "RETRO & PIXEL");
            Category packCollection = upsertCategory(categoryRepository, "Collection", "Pack Collection");

            upsertProduct(productRepository, "Pack Collection  ", new BigDecimal("59.99"), "/product-images/pack1.webp", "Pack Collection.",packCollection, 2);
            upsertProduct(productRepository, "Retro & Pixel", new BigDecimal("14.99"), "/product-images/retro.png", "Casque confortable.",retro, 10);
            upsertProduct(productRepository, "horror collection", new BigDecimal("14.99"), "/product-images/horror.png", "horror pack", horror, 10);
            upsertProduct(productRepository, "Fantasy & Rpg", new BigDecimal("14.99"), "/product-images/fantasy.png", "Fantasy games", fantasy, 10);
            upsertProduct(productRepository, "Racing & Speed", new BigDecimal("14.99"), "/product-images/racing.png", "Racing games.", racing, 10);
            upsertProduct(productRepository, "Scfi & space", new BigDecimal("14.99"), "/product-images/scfi.png", "scifi games.", scifi, 10);

            if (!userRepository.existsByEmailIgnoreCase("test@estore.com")) {
                User user = new User();
                user.setFirstName("Test");
                user.setLastName("User");
                user.setEmail("test@estore.com");
                user.setPasswordHash(passwordEncoder.encode("password"));

                Profile profile = new Profile();
                profile.setPhone("0600000000");
                profile.setCity("Casablanca");
                profile.setCountry("Morocco");
                profile.setAddress("123 Rue Exemple");
                user.setProfile(profile);

                userRepository.save(user);
            }
        };
    }

    private Category upsertCategory(CategoryRepository categoryRepository, String name, String description) {
        Category category = categoryRepository.findAll().stream()
                .filter(existing -> existing.getName() != null && existing.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(Category::new);
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private Product upsertProduct(ProductRepository productRepository,
                                  String name,
                                  BigDecimal price,
                                  String imageUrl,
                                  String description,
                                  Category category,
                                  int stock) {
        Product product = productRepository.findAll().stream()
                .filter(existing -> existing.getName() != null && existing.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(Product::new);

        product.setName(name);
        product.setPrice(price);
        product.setImageUrl(imageUrl);
        product.setDescription(description);
        product.setCategory(category);

        if (product.getInventory() == null) {
            product.setInventory(new Inventory());
        }
        product.getInventory().setQuantity(stock);

        return productRepository.save(Objects.requireNonNull(product));
    }

}
