package com.estore.config;

import com.estore.review.repository.ReviewRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@Profile("mongo")
@EnableMongoRepositories(basePackageClasses = ReviewRepository.class)
public class MongoRepositoriesConfig {
}
