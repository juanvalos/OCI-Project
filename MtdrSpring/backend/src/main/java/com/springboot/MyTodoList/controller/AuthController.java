package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.AuthService;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User authenticatedUser = authService.authenticate(user);
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping(value = "/profile/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = authService.getUserById(id);
        if (user != null) {
            User responseUser = new User();
            responseUser.setName(user.getName());
            responseUser.setMail(user.getMail());
            responseUser.setRole(user.getRole());
            responseUser.setModality(user.getModality());
            return ResponseEntity.ok(responseUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        List<User> responseUsers = users.stream()
                .map(user -> {
                    User responseUser = new User();
                    responseUser.setId(user.getId());
                    responseUser.setName(user.getName());
                    return responseUser;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseUsers);
    }
}