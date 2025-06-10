package com.springboot.MyTodoList.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.TwoFactorService;

import com.springboot.MyTodoList.service.BackupCodeService;
import com.springboot.MyTodoList.model.BackupCode;
import com.springboot.MyTodoList.repository.BackupCodeRepository;

import org.springframework.http.HttpStatus;


@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TwoFactorService twoFactorService;

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User authenticatedUser = authService.authenticate(loginRequest);
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // If 2FA is enabled, don’t log in yet—tell the client to collect a code
        if (authenticatedUser.getTwoFaEnabled() != null
            && authenticatedUser.getTwoFaEnabled() == 1) {
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                                 .body(authenticatedUser);
        }

        // Otherwise full login
        return ResponseEntity.ok(authenticatedUser);
    }


    @PostMapping("/2fa/verify")
    public ResponseEntity<?> verifyCode(@RequestBody CodeRequest req) {
    User user = authService.getUserById(req.getUserId());
    if (user == null || user.getTwoFaSecret() == null) {
        return ResponseEntity.status(401).body("2FA not configured");
    }

    boolean ok = twoFactorService.verifyCode(user.getTwoFaSecret(), req.getCode());
    if (!ok) {
        return ResponseEntity.status(401).body("Invalid 2FA code");
    }

    // Only now enable 2FA
    user.setTwoFaEnabled(1);
    authService.updateUser(user);

    return ResponseEntity.ok("2FA verified");
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = authService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        User responseUser = new User();
        responseUser.setId(user.getId());
        responseUser.setName(user.getName());
        responseUser.setMail(user.getMail());
        responseUser.setRole(user.getRole());
        responseUser.setModality(user.getModality());
        responseUser.setTwoFaEnabled(user.getTwoFaEnabled());
        return ResponseEntity.ok(responseUser);
    }

    @GetMapping("/users")
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

    public static class CodeRequest {
        private int userId;
        private String code;

        public int getUserId() { return userId; }
        public void setUserId(int userId) { this.userId = userId; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    @PostMapping("/2fa/setup/{id}")
    public ResponseEntity<?> setup2FA(@PathVariable int id) {
        User user = authService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String secret = twoFactorService.generateSecret();
        user.setTwoFaSecret(secret);
        authService.updateUser(user);

        String otpAuthUrl = twoFactorService.getOtpAuthURL(user.getMail(), secret);
        // Return as JSON object
        return ResponseEntity.ok(Collections.singletonMap("qrCodeUrl", otpAuthUrl));
    }


    @Autowired
        private BackupCodeService backupCodeService;
    @Autowired
        private BackupCodeRepository backupCodeRepository;
    

    public static class BackupCodeRequest {
        private Long userId;
        private String code;
        // getters/setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    @PostMapping("/2fa/backup/generate/{id}")
    public ResponseEntity<List<String>> generateBackupCodes(@PathVariable Long id) {
        // 1) make sure user exists
        User user = authService.getUserById(id.intValue());
        if (user == null) return ResponseEntity.notFound().build();

        // 2) generate raw codes & hash+persist
        List<String> raw = backupCodeService.generateRawCodes(5);
        for (String code : raw) {
            String hash = backupCodeService.hashCode(code);
            backupCodeRepository.save(new BackupCode(id, hash));
        }

        // 3) return the raw codes so user can save them
        return ResponseEntity.ok(raw);
    }

    
}
