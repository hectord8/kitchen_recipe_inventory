package com.example.kitchen.recipes;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.List;

@RegisterBeanMapper(Recipe.class)
public interface RecipeDAO {

    @SqlQuery("""
        SELECT id, title, category, diet, image, prep_time, cook_time, description , creator
        FROM recipes
        ORDER BY id DESC
    """)
    List<Recipe> getAllRecipes();

    @SqlQuery("""
        SELECT DISTINCT TRIM(diet)
        FROM recipes
        WHERE diet IS NOT NULL AND TRIM(diet) <> ''
        ORDER BY TRIM(diet)
    """)
    List<String> getAllDiets();

    @SqlQuery("""
        SELECT DISTINCT TRIM(category)
        FROM recipes
        WHERE category IS NOT NULL AND TRIM(category) <> ''
        ORDER BY TRIM(category)
    """)
    List<String> getAllCats();

    @SqlUpdate("""
        INSERT INTO recipes (title, category, diet, image, prep_time, cook_time, description , creator)
        VALUES (:title, :category, :diet, :image, :prepTime, :cookTime, :description , :creator)
    """)
    @GetGeneratedKeys
    Recipe insert(@BindBean Recipe recipe);

    @SqlUpdate("DELETE FROM recipes WHERE id = :id")
    void deleteById(@Bind("id") int id);


}
