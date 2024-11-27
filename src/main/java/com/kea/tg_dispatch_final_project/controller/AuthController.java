package com.kea.tg_dispatch_final_project.controller;

import com.kea.tg_dispatch_final_project.model.User;
import com.kea.tg_dispatch_final_project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://happy-pebble-09177e503.5.azurestaticapps.net")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        Map<String, String> loginResponse = authService.login(user);
        if ("Invalid credentials".equals(loginResponse.get("message"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }
        return ResponseEntity.ok(loginResponse);
    }

}
