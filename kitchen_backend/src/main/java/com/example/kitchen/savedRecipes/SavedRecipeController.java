package com.example.kitchen.savedRecipes;

import com.example.kitchen.Customer;
import com.example.kitchen.recipes.Recipe;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/saved-recipes")
public class SavedRecipeController {


    private final SavedRecipeDAO savedRecipeDao;

    public SavedRecipeController(SavedRecipeDAO savedRecipeDao) {
        this.savedRecipeDao = savedRecipeDao;
    }


    private Customer requireCustomer(HttpSession session) {
        Object obj = session.getAttribute("customer");
        return (obj instanceof Customer c) ? c : null;
    }


    @PostMapping("/{recipeId}")
    public ResponseEntity<?> save(@PathVariable int recipeId,
                                  @RequestBody(required = false) SavedRecipe body,
                                  HttpSession session) {

        Customer customer = requireCustomer(session);
        if (customer == null) return ResponseEntity.status(401).body("Not logged in");

        String description = (body != null) ? body.getDescription() : null;

        SavedRecipe sr = new SavedRecipe(customer.getId(), recipeId, null, description);
        savedRecipeDao.saveRecipe(sr);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> unsave(@PathVariable int recipeId, HttpSession session) {

        Customer customer = requireCustomer(session);
        if (customer == null) return ResponseEntity.status(401).body("Not logged in");

        savedRecipeDao.unsaveRecipe(customer.getId(), recipeId);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/ids")
    public ResponseEntity<?> getMySavedIds(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("customer");
        if (customer == null) return ResponseEntity.status(401).body("Not logged in");

        return ResponseEntity.ok(savedRecipeDao.getAllSaved(customer.getId()));
    }





}
