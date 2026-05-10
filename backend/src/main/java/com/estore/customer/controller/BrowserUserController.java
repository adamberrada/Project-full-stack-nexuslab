package com.estore.customer.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estore.customer.repository.UserRepository;

@RestController
@RequestMapping("/debug")
public class BrowserUserController {

    private final UserRepository userRepository;

    @Autowired
    public BrowserUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static record UserView(Long id, String firstName, String lastName, String email) {}

    @GetMapping("/users")
    public List<UserView> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserView(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail()))
                .collect(Collectors.toList());
    }
}
