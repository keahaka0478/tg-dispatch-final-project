package com.kea.tg_dispatch_final_project.security;

import com.kea.tg_dispatch_final_project.model.User;
import com.kea.tg_dispatch_final_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // test admin
        if (userRepository.findByUsername("admin") == null) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ADMIN");

            userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
        } else {
            System.out.println("Admin user already exists. Skipping creation.");
        }

        // test driver
        if (userRepository.findByUsername("driver") == null) {
            User driverUser = new User();
            driverUser.setUsername("driver");
            driverUser.setPassword(passwordEncoder.encode("driver123"));
            driverUser.setRole("DRIVER");

            userRepository.save(driverUser);
            System.out.println("Driver user created successfully!");
        } else {
            System.out.println("Driver user already exists. Skipping creation.");
        }
    }
}
