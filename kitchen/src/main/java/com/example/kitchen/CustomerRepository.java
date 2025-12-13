package com.example.kitchen;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerRepository {
    private final JdbcTemplate jdbc;

    public CustomerRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int insert(Customer c) {
        return jdbc.update(
                "INSERT INTO customers (id, FIRST_NAME , LAST_NAME, EMAIL) VALUES (?, ?, ?, ?)",
                c.getId(), c.getFirstName(), c.getLastName() ,  c.getEmail()
        );
    }


}
