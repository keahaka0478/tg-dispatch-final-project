package com.kea.tg_dispatch_final_project.service;

import com.kea.tg_dispatch_final_project.model.User;
import com.kea.tg_dispatch_final_project.repository.UserRepository;
import com.kea.tg_dispatch_final_project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, String> login(User user) {
        Map<String, String> response = new HashMap<>();
        User existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            String token = jwtUtil.generateToken(existingUser.getUsername(), existingUser.getRole());
            response.put("token", token);
            response.put("role", existingUser.getRole());
            return response;
        }

        response.put("message", "Invalid credentials");
        return response;
    }
}
