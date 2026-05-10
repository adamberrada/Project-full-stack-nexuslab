package com.estore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = {
                "com.estore.customer.repository",
                "com.estore.catalog.repository",
                "com.estore.inventory.repository",
                "com.estore.shopping.repository",
                "com.estore.billing.repository"
        }
)
public class JpaRepositoriesConfig {
}
