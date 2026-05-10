package com.estore.customer.service;

import com.estore.customer.dto.*;
import com.estore.customer.entity.Profile;
import com.estore.customer.entity.User;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.BadRequestException;
import com.estore.exception.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BadRequestException("Email already in use");
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        Profile profile = new Profile();
        profile.setPhone(request.phone());
        profile.setAddress(request.address());
        profile.setCity(request.city());
        profile.setCountry(request.country());
        user.setProfile(profile);

        User saved = userRepository.save(user);
        return new RegisterResponse(saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail());
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }

        return new LoginResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            return new ProfileResponse(user.getId(), null, null, null, null);
        }
        return new ProfileResponse(user.getId(), profile.getPhone(), profile.getAddress(), profile.getCity(), profile.getCountry());
    }

    @Transactional
    public ProfileResponse updateProfile(long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = new Profile();
            user.setProfile(profile);
        }

        profile.setPhone(request.phone());
        profile.setAddress(request.address());
        profile.setCity(request.city());
        profile.setCountry(request.country());

        userRepository.save(user);
        return new ProfileResponse(user.getId(), profile.getPhone(), profile.getAddress(), profile.getCity(), profile.getCountry());
    }

    @Transactional(readOnly = true)
    public User getUserEntity(long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
