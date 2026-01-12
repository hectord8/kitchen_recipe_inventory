package com.example.kitchen.recipes;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;


@RestController
@RequestMapping("/recipes")
public class RecipeController {

    @Value("${spoonacular.base-url}")
    private String spoonacularBaseUrl;

    @Value("${spoonacular.api-key}")
    private String spoonacularApiKey;

    private final RecipeDAO recipeDao;
    private final RecipeImportService importService;

    public RecipeController(RecipeDAO recipeDao , RecipeImportService importService) {
        this.recipeDao = recipeDao;
        this.importService = importService;
    }


    // 1) General: list all recipes
    @GetMapping
    public List<Recipe> getAll() {
        return recipeDao.getAllRecipes();
    }

//    @GetMapping("/Diets")
//    public List<String> getAllDiets() {
//        return recipeDao.getAllDiets();
//    }

    @PostMapping("/recipes")
    public ResponseEntity<Recipe> insert(@RequestBody Recipe recipe) {
        Recipe saved = recipeDao.insert(recipe);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResult> importRecipes(
            @RequestParam(defaultValue = "5") int count
    ) {
        // optional safety clamp
        if (count < 1) count = 1;
        if (count > 50) count = 50; // Spoonacular typically allows up to 100, but 50 is a nice safe limit

        ImportResult result = importService.importRandomRecipes(count);
        return ResponseEntity.ok(result);
    }

}
