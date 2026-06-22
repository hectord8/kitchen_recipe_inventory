package com.example.kitchen.recipes;

import java.util.List;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

@RegisterBeanMapper(Recipe.class)
public interface RecipeDAO {

  @SqlQuery(
      """
        SELECT
            id,
            spoonacular_id AS spoonacularId,
            title,
            image,
            summary,
            instructions,
            ingredients_json AS ingredientsJson,
            instruction_steps_json AS instructionStepsJson,
            prep_minutes AS prepMinutes,
            cook_minutes AS cookMinutes,
            ready_minutes AS readyMinutes,
            calories,
            diet,
            category,
            description,
            created_at AS createdAt,
            creator

        FROM recipes
        ORDER BY id DESC
    """)
  List<Recipe> getAllRecipes();

  @SqlQuery(
      """
        SELECT DISTINCT TRIM(diet)
        FROM recipes
        WHERE diet IS NOT NULL AND TRIM(diet) <> ''
        ORDER BY TRIM(diet)
    """)
  List<String> getAllDiets();

  @SqlUpdate(
      """
        INSERT INTO recipes (
            spoonacular_id,
            title,
            image,
            summary,
            instructions,
            ingredients_json,
            instruction_steps_json,
            prep_minutes,
            cook_minutes,
            ready_minutes,
            calories,
            diet,
            category,
            description,
            creator
        )
        VALUES (
            :spoonacularId,
            :title,
            :image,
            :summary,
            :instructions,
            :ingredientsJson,
            :instructionStepsJson,
            :prepMinutes,
            :cookMinutes,
            :readyMinutes,
            :calories,
            :diet,
            :category,
            :description,
            :creator
        )

    """)
  @GetGeneratedKeys
  Recipe insert(@BindBean Recipe recipe);

  @SqlQuery(
      """
        SELECT EXISTS(
            SELECT 1
            FROM recipes
            WHERE spoonacular_id = :spoonacularId
        )
    """)
  boolean existsBySpoonacularId(@Bind("spoonacularId") int spoonacularId);
}
