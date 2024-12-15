package com.kea.tg_dispatch_final_project.service;

import com.kea.tg_dispatch_final_project.model.Customer;
import com.kea.tg_dispatch_final_project.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer != null) {
            customerRepository.delete(customer);
        } else {
            throw new RuntimeException("Customer not found");
        }
    }

    public Customer updateCustomer(Long id, Customer customer) {
        Customer existingCustomer = customerRepository.findById(id).orElse(null);
        if (existingCustomer == null) {
            throw new RuntimeException("Customer not found");
        }

        if (customer.getName() != null && !customer.getName().isEmpty()) {
            existingCustomer.setName(customer.getName());
        }
        if (customer.getAddress() != null && !customer.getAddress().isEmpty()) {
            existingCustomer.setAddress(customer.getAddress());
        }
        if (customer.getZip() != null && !customer.getZip().isEmpty()) {
            existingCustomer.setZip(customer.getZip());
        }
        if (customer.getCity() != null && !customer.getCity().isEmpty()) {
            existingCustomer.setCity(customer.getCity());
        }
        if (customer.getVat() != null && !customer.getVat().isEmpty()) {
            existingCustomer.setVat(customer.getVat());
        }
        if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
            existingCustomer.setEmail(customer.getEmail());
        }
        if (customer.getPhone() != null && !customer.getPhone().isEmpty()) {
            existingCustomer.setPhone(customer.getPhone());
        }

        return customerRepository.save(existingCustomer);
    }

}