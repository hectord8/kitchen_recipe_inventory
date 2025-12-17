package com.example.kitchen.recipes;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RecipeDAO {

    private final JdbcTemplate jdbc;

    public RecipeDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }



    public List<Recipe> getAllrecipes() {
        return jdbc.query(
                "SELECT id, title, category , diet , image, spoonacular_id FROM recipes ORDER BY id DESC",
                (rs, rowNum) -> new Recipe(
                        rs.getInt("id"),
                         rs.getInt("spoonacular_id"),
                        rs.getString("title"),
                        rs.getString("category"),
                        rs.getString("diet"),
                        rs.getString("image")
                )
        );
    }

    public List<String> getAllDiets() {
        return jdbc.queryForList(
                "SELECT DISTINCT diet FROM recipes WHERE diet IS NOT NULL AND diet <> '' ORDER BY diet",
                String.class
        );
    }

    public List<String> getAllCats() {
        return jdbc.queryForList(
                "SELECT DISTINCT category FROM recipes WHERE category IS NOT NULL AND category <> '' ORDER BY category",
                String.class
        );
    }





}
