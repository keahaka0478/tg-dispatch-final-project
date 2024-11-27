package com.kea.tg_dispatch_final_project.repository;

import com.kea.tg_dispatch_final_project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
