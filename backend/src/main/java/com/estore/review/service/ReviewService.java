package com.estore.review.service;

import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.NotFoundException;
import com.estore.review.document.Review;
import com.estore.review.dto.CreateReviewRequest;
import com.estore.review.dto.ReviewResponse;
import com.estore.review.repository.ReviewRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Profile("mongo")
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public ReviewResponse create(CreateReviewRequest request) {
        if (!productRepository.existsById(request.productId())) {
            throw new NotFoundException("Product not found");
        }

        Review review = new Review();
        review.setProductId(request.productId());
        review.setUserId(request.userId());
        review.setAuthorName(request.authorName());
        review.setRating(request.rating());
        review.setComment(request.comment());

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    public List<ReviewResponse> listByProduct(long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NotFoundException("Product not found");
        }

        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProductId(),
                review.getUserId(),
                review.getAuthorName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
