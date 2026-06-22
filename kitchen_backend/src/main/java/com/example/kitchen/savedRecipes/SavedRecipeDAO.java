package com.example.kitchen.savedRecipes;

import com.example.kitchen.recipes.Recipe;
import java.util.List;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface SavedRecipeDAO {

  @SqlUpdate(
      """
        INSERT INTO customer_saved_recipes (customer_id, recipe_id, description)
        VALUES (:customerId, :recipeId, :description)
    """)
  void saveRecipe(@BindBean SavedRecipe savedRecipe);

  @SqlUpdate(
      """
        DELETE FROM customer_saved_recipes
        WHERE customer_id = :customerId
          AND recipe_id = :recipeId
    """)
  void unsaveRecipe(@Bind("customerId") int customerId, @Bind("recipeId") int recipeId);

  @SqlQuery(
      """
        SELECT COUNT(*) > 0
        FROM customer_saved_recipes
        WHERE customer_id = :customerId
          AND recipe_id = :recipeId
    """)
  boolean isRecipeSaved(@Bind("customerId") int customerId, @Bind("recipeId") int recipeId);

  @RegisterBeanMapper(Recipe.class)
  @SqlQuery(
      """
          SELECT r.id, r.title, r.diet, r.image AS imageUrl
          FROM recipes r
          JOIN Customer_saved_recipes s ON s.recipe_id = r.id
          WHERE s.customer_id = :customerId
        """)
  List<Recipe> getAllSaved(@Bind("customerId") int customerId);
}
