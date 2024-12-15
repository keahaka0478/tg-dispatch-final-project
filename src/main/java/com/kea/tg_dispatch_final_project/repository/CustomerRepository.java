package com.kea.tg_dispatch_final_project.repository;

import com.kea.tg_dispatch_final_project.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
