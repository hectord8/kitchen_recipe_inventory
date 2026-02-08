package com.example.kitchen.recipes;

import java.time.LocalDateTime;

public class Recipe {


    private Integer id;
    private Integer spoonacularId;
    private String title;
    private String image;
    private String summary;
    private String instructions;
    private String ingredientsJson;
    private String instructionStepsJson;
    private Integer prepMinutes;
    private Integer cookMinutes;
    private Integer readyMinutes;
    private Integer calories;
    private String diet;
    private LocalDateTime createdAt;
    private String creator;



    public Recipe() {}


    public Recipe(
            Integer spoonacularId,
            String title,
            String image,
            String summary,
            String instructions,
            String ingredientsJson,
            String instructionStepsJson,
            Integer prepMinutes,
            Integer cookMinutes,
            Integer readyMinutes,
            Integer calories,
            String diet,
            String creator
    ) {
        this.spoonacularId = spoonacularId;
        this.title = title;
        this.image = image;
        this.summary = summary;
        this.instructions = instructions;
        this.ingredientsJson = ingredientsJson;
        this.instructionStepsJson = instructionStepsJson;
        this.prepMinutes = prepMinutes;
        this.cookMinutes = cookMinutes;
        this.readyMinutes = readyMinutes;
        this.calories = calories;
        this.diet = diet;
        this.creator = creator;
    }


    // ===== Getters & Setters =====

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSpoonacularId() {
        return spoonacularId;
    }

    public void setSpoonacularId(Integer spoonacularId) {
        this.spoonacularId = spoonacularId;
    }

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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getIngredientsJson() {
        return ingredientsJson;
    }

    public void setIngredientsJson(String ingredientsJson) {
        this.ingredientsJson = ingredientsJson;
    }

    public String getInstructionStepsJson() {
        return instructionStepsJson;
    }

    public void setInstructionStepsJson(String instructionStepsJson) {
        this.instructionStepsJson = instructionStepsJson;
    }


    public Integer getPrepMinutes() {
        return prepMinutes;
    }

    public void setPrepMinutes(Integer prepMinutes) {
        this.prepMinutes = prepMinutes;
    }

    public Integer getCookMinutes() {
        return cookMinutes;
    }

    public void setCookMinutes(Integer cookMinutes) {
        this.cookMinutes = cookMinutes;
    }

    public Integer getReadyMinutes() {
        return readyMinutes;
    }

    public void setReadyMinutes(Integer readyMinutes) {
        this.readyMinutes = readyMinutes;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public String getDiet() {
        return diet;
    }

    public void setDiet(String diet) {
        this.diet = diet;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }
}
