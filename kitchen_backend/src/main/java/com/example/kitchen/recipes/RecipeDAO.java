package com.example.kitchen.recipes;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RecipeDAO {

    private final JdbcTemplate jdbc;

    public RecipeDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }



    public List<recipe> getAllrecipes() {
        return jdbc.query(
                "SELECT id, title, image, spoonacular_id FROM recipes ORDER BY id DESC",
                (rs, rowNum) -> new recipe(
                        rs.getInt("id"),
                         rs.getInt("spoonacular_id"),
                        rs.getString("title"),
                        rs.getString("image")
                )
        );
    }



}
