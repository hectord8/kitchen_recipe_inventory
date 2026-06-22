package com.example.kitchen.savedRecipes;

import java.time.LocalDateTime;

public class SavedRecipe {

  private int customerId;
  private int recipeId;
  private LocalDateTime savedAt;
  private String description;

  public SavedRecipe(int customerId, int recipeId, LocalDateTime savedAt, String description) {
    this.customerId = customerId;
    this.recipeId = recipeId;
    this.savedAt = savedAt;
    this.description = description;
  }

  public SavedRecipe() {}

  public int getCustomerId() {
    return customerId;
  }

  public void setCustomerId(int customerId) {
    this.customerId = customerId;
  }

  public int getRecipeId() {
    return recipeId;
  }

  public void setRecipeId(int recipeId) {
    this.recipeId = recipeId;
  }

  public LocalDateTime getSavedAt() {
    return savedAt;
  }

  public void setSavedAt(LocalDateTime savedAt) {
    this.savedAt = savedAt;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
