package com.example.kitchen.recipes;

public class Recipe {

    private int id;
    private Integer spoonacularId; // nullable for test data
    private String title;
    private String category;
    private String diet;
    private String imageUrl;


    public Recipe(int id, Integer spoonacularId, String title, String category, String diet, String imageUrl) {
        this.id = id;
        this.spoonacularId = spoonacularId;
        this.title = title;
        this.category = category;
        this.diet = diet;
        this.imageUrl = imageUrl;
    }


    public Recipe() {}


    public int getId() {
        return id;
    }

    public void setId(int id) {
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


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
