package com.example.kitchen.recipes;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RecipeDto {

  @NotBlank(message = "Title is required")
  private String title;

  private String image;

  @NotBlank(message = "Category is required")
  private String category;

  private String diet;

  @Min(value = 0, message = "Prep time must be 0 or more")
  private Integer prepTime;

  @Min(value = 0, message = "Cook time must be 0 or more")
  private Integer cookTime;

  @Size(max = 1000, message = "Description must be 1000 characters or less")
  private String description;

  @NotBlank(message = "Creator is required")
  private String creator;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getDiet() {
    return diet;
  }

  public void setDiet(String diet) {
    this.diet = diet;
  }

  public Integer getPrepTime() {
    return prepTime;
  }

  public void setPrepTime(Integer prepTime) {
    this.prepTime = prepTime;
  }

  public Integer getCookTime() {
    return cookTime;
  }

  public void setCookTime(Integer cookTime) {
    this.cookTime = cookTime;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }
}
