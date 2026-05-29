package com.example.kitchen.customer;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class CustomerDAO {
    private final JdbcTemplate jdbc;

    public CustomerDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Customer insert(Customer c) {
        jdbc.update(
                "INSERT INTO CUSTOMERS (firstname, PASSWORD, EMAIL) VALUES (?, ?, ?)",
                c.getFirstName(),
                c.getPassword(),
                c.getEmail()
        );

        return c;
    }

    public List<Customer> getAll() {
        return jdbc.query(
                "SELECT id, firstname, PASSWORD, email FROM customers",
                (rs, rowNum) -> new Customer(
                        rs.getInt("id"),
                        rs.getString("firstname"),
                        rs.getString("PASSWORD"),
                        rs.getString("email")
                )
        );
    }

    public Customer getCustomerByLogin(String email ) {

        return jdbc.queryForObject(
                "SELECT id, firstname, PASSWORD, email FROM customers WHERE LOWER(email) = LOWER(?)",
                (rs, rowNum) -> new Customer(
                        rs.getInt("id"),
                        rs.getString("firstname"),
                        rs.getString("PASSWORD"),
                        rs.getString("email")
                ),
                email

        );

    }

    public Customer getById(int id ) {

        return jdbc.queryForObject(
                "SELECT id, firstname, email, password FROM customers WHERE id = ?",
                (rs, rowNum) -> new Customer(
                        rs.getInt("id"),
                        rs.getString("firstname"),
                        rs.getString("PASSWORD"),
                        rs.getString("email")
                ),
                    id

        );

    }




}
