package com.example.kitchen.customer;

import lombok.Data;
import lombok.ToString;

// Customer entity class
@Data
public class Customer {

    private Integer id;
    private String firstName;
    private String password;
    private String email;

    // Default constructor
    public Customer() {}

    // Parameterized constructor
    public Customer(Integer id, String firstName, String password, String email) {
        this.id = id;
        this.firstName = firstName;
        this.password = password;
        this.email = email;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


}