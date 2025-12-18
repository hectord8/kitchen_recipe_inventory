package com.example.kitchen.recipes;

public class Recipe {

    private Integer id;
    private String title;
    private String category;
    private String diet;
    private String image;
    private Integer prepTime;
    private Integer cookTime;
    private String description;
    private String creator;

    public Recipe() {}

    public Recipe(Integer id, String title, String category, String diet, String image,
                  Integer prepTime, Integer cookTime, String description , String creator) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.diet = diet;
        this.image = image;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.description = description;
        this.creator = creator;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getPrepTime() { return prepTime; }
    public void setPrepTime(Integer prepTime) { this.prepTime = prepTime; }

    public Integer getCookTime() { return cookTime; }
    public void setCookTime(Integer cookTime) { this.cookTime = cookTime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }


    public String getCreator(){ return creator ;}
    public void setCreator(String creator) { this.creator = creator;}
}
