package com.example.kitchen.recipes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;


@RestController
@RequestMapping("/recipes")
public class RecipeController {

    @Autowired
    private final RecipeDAO recipeDao;

    public RecipeController(RecipeDAO recipeDao) {
        this.recipeDao = recipeDao;
    }


    // 1) General: list all recipes
    @GetMapping
    public List<Recipe> getAll() {
        return recipeDao.getAllRecipes();
    }

    @GetMapping("/Diets")
    public List<String> getAllDiets() {
        return recipeDao.getAllDiets();
    }

    @GetMapping("/Category")
    public List<String> getAllCats() {
        return recipeDao.getAllCats();
    }

    @PostMapping("/recipes")
    public ResponseEntity<Recipe> insert(@RequestBody Recipe recipe) {
        Recipe saved = recipeDao.insert(recipe);

        return ResponseEntity.ok(saved);
    }
}
