package com.springboot.MyTodoList.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private Map<Long, Integer> userContext = new HashMap<>();

    public User authenticate(User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser != null && foundUser.getPassword().equals(user.getPassword())) {
            return foundUser;
        }
        return null;
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void setCurrentUserId(long chatId, int userId) {
        userContext.put(chatId, userId);
    }

    public Optional<Integer> getCurrentUserId(long chatId) {
        return Optional.ofNullable(userContext.get(chatId));
    }

    public String getUserNameById(int userId) {
        return userRepository.findById(userId)
                             .map(User::getName) // Suponiendo que la entidad User tiene un campo "name"
                             .orElse("Usuario desconocido");
    }
}