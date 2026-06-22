package com.example.kitchen.customer;

import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerDAO {
  private final JdbcTemplate jdbc;

  public CustomerDAO(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public Customer insert(Customer c) {
    jdbc.update(
        "INSERT INTO CUSTOMERS (firstname, PASSWORD, EMAIL, role) VALUES (?, ?, ?, ?)",
        c.getFirstName(),
        c.getPassword(),
        c.getEmail(),
        c.getRole());

    return c;
  }

  public List<Customer> getAll() {
    return jdbc.query(
        "SELECT id, firstname, PASSWORD, email, role FROM customers",
        (rs, rowNum) ->
            new Customer(
                rs.getInt("id"),
                rs.getString("firstname"),
                rs.getString("PASSWORD"),
                rs.getString("email"),
                rs.getString("role")));
  }

  public Customer getCustomerByLogin(String email) {
    List<Customer> results =
        jdbc.query(
            "SELECT id, firstname, PASSWORD, email, role FROM customers WHERE LOWER(email) = LOWER(?)",
            (rs, rowNum) ->
                new Customer(
                    rs.getInt("id"),
                    rs.getString("firstname"),
                    rs.getString("PASSWORD"),
                    rs.getString("email"),
                    rs.getString("role")),
            email);
    return results.isEmpty() ? null : results.get(0);
  }

  public Customer getById(int id) {
    List<Customer> results =
        jdbc.query(
            "SELECT id, firstname, email, password, role FROM customers WHERE id = ?",
            (rs, rowNum) ->
                new Customer(
                    rs.getInt("id"),
                    rs.getString("firstname"),
                    rs.getString("PASSWORD"),
                    rs.getString("email"),
                    rs.getString("role")),
            id);
    return results.isEmpty() ? null : results.get(0);
  }
}
