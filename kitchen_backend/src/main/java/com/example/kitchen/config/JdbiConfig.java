package com.example.kitchen.config;

import javax.sql.DataSource;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class JdbiConfig {

  @Bean
  public Jdbi jdbi(DataSource dataSource) {
    Jdbi jdbi = Jdbi.create(dataSource);
    jdbi.installPlugin(new SqlObjectPlugin()); // IMPORTANT for @SqlQuery/@SqlUpdate
    return jdbi;
  }

  @Bean
  public com.example.kitchen.savedRecipes.SavedRecipeDAO savedRecipeDAO(Jdbi jdbi) {
    return jdbi.onDemand(com.example.kitchen.savedRecipes.SavedRecipeDAO.class);
  }

  @Bean
  public com.example.kitchen.recipes.RecipeDAO RecipeDAO(Jdbi jdbi) {
    return jdbi.onDemand(com.example.kitchen.recipes.RecipeDAO.class);
  }

  @Bean
  public com.example.kitchen.inventory.InventoryDAO InventoryDAO(Jdbi jdbi) {
    return jdbi.onDemand(com.example.kitchen.inventory.InventoryDAO.class);
  }

  @Bean
  public WebClient.Builder webClientBuilder() {
    return WebClient.builder();
  }
}
