package com.example.kitchen.recipes;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private final RecipeDAO recipeDao;

    public RecipeController(RecipeDAO recipeDao) {
        this.recipeDao = recipeDao;
    }



    // 1) General: list all recipes
    @GetMapping
    public List<recipe> getAll() {
        return recipeDao.getAllrecipes();
    }

    @GetMapping("/Diets")
    public List<String> getAllDiets() {
        return recipeDao.getAllDiets();
    }

    @GetMapping("/Category")
    public List<String> getAllCats() {
        return recipeDao.getAllCats();
    }





}
