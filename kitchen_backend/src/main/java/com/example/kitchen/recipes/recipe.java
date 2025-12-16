package com.example.kitchen.recipes;

public class recipe {

    private int id;
    private Integer spoonacularId; // nullable for test data
    private String title;
    private String imageUrl;

    // ✅ Full constructor (used when reading from DB)
    public recipe(int id, Integer spoonacularId, String title, String imageUrl) {
        this.id = id;
        this.spoonacularId = spoonacularId;
        this.title = title;
        this.imageUrl = imageUrl;
    }

    // ✅ Constructor without id (used before insert)
    public recipe(Integer spoonacularId, String title, String imageUrl) {
        this.spoonacularId = spoonacularId;
        this.title = title;
        this.imageUrl = imageUrl;
    }

    // ✅ Empty constructor (required by Jackson / Spring sometimes)
    public recipe() {}

    // getters & setters
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
