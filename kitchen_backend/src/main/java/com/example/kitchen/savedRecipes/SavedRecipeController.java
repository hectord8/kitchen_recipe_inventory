package com.example.kitchen.savedRecipes;

import com.example.kitchen.customer.Customer;
import com.example.kitchen.customer.CustomerDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saved-recipes")
public class SavedRecipeController {

  private final SavedRecipeDAO savedRecipeDao;
  private final CustomerDAO customerDao;

  public SavedRecipeController(SavedRecipeDAO savedRecipeDao, CustomerDAO customerDao) {
    this.savedRecipeDao = savedRecipeDao;
    this.customerDao = customerDao;
  }

  private Customer requireCustomer(Authentication auth) {
    if (auth == null) return null;
    String email = auth.getName(); // JWT subject you set in the filter
    return customerDao.getCustomerByLogin(email);
  }

  @PostMapping("/{recipeId}")
  public ResponseEntity<?> save(
      @PathVariable int recipeId,
      @RequestBody(required = false) SavedRecipe body,
      Authentication auth) {
    Customer customer = requireCustomer(auth);
    if (customer == null) return ResponseEntity.status(401).body("Not logged in");

    String description = (body != null) ? body.getDescription() : null;

    SavedRecipe sr = new SavedRecipe(customer.getId(), recipeId, null, description);
    savedRecipeDao.saveRecipe(sr);

    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{recipeId}")
  public ResponseEntity<?> unsave(@PathVariable int recipeId, Authentication auth) {
    Customer customer = requireCustomer(auth);
    if (customer == null) return ResponseEntity.status(401).body("Not logged in");

    savedRecipeDao.unsaveRecipe(customer.getId(), recipeId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/ids")
  public ResponseEntity<?> getMySavedIds(Authentication auth) {
    Customer customer = requireCustomer(auth);
    if (customer == null) return ResponseEntity.status(401).body("Not logged in");

    return ResponseEntity.ok(savedRecipeDao.getAllSaved(customer.getId()));
  }
}
