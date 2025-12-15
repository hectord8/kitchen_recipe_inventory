package com.example.kitchen;

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
                "INSERT INTO CUSTOMERS (FIRST_NAME, PASSWORD, EMAIL) VALUES (?, ?, ?)",
                c.getFirstName(),
                c.getPassWord(),
                c.getEmail()
        );

        return c;
    }

    public List<Customer> getAll() {
        return jdbc.query(
                "SELECT id, first_name, PASSWORD, email FROM customers",
                (rs, rowNum) -> new Customer(
                        rs.getInt("id"),
                        rs.getString("first_name"),
                        rs.getString("PASSWORD"),
                        rs.getString("email")
                )
        );
    }

    public Customer getCustomerByLogin(String firstName ) {
        System.out.println(firstName );
        return jdbc.queryForObject(
                "SELECT id, first_name, PASSWORD, email FROM customers WHERE first_name = ? ",
                (rs, rowNum) -> new Customer(
                        rs.getInt("id"),
                        rs.getString("first_name"),
                        rs.getString("PASSWORD"),
                        rs.getString("email")
                ),
                firstName

        );

    }




}
