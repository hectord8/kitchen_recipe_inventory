package com.example.kitchen.recipes;

import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

  @Value("${spoonacular.base-url}")
  private String spoonacularBaseUrl;

  @Value("${spoonacular.api-key}")
  private String spoonacularApiKey;

  private final RecipeDAO recipeDao;
  private final RecipeImportService importService;

  public RecipeController(RecipeDAO recipeDao, RecipeImportService importService) {
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

  @PostMapping
  public ResponseEntity<?> insert(@Valid @RequestBody RecipeDto dto) {
    Recipe recipe = new Recipe();
    recipe.setTitle(dto.getTitle());
    recipe.setImage(dto.getImage() != null ? dto.getImage() : "");
    recipe.setCategory(dto.getCategory());
    recipe.setDiet(dto.getDiet());
    recipe.setPrepMinutes(dto.getPrepTime());
    recipe.setCookMinutes(dto.getCookTime());
    recipe.setDescription(dto.getDescription());
    recipe.setCreator(dto.getCreator());

    Recipe saved = recipeDao.insert(recipe);

    return ResponseEntity.ok(saved);
  }

  @PostMapping("/import")
  public ResponseEntity<ImportResult> importRecipes(@RequestParam(defaultValue = "5") int count) {
    // optional safety clamp
    if (count < 1) count = 1;
    if (count > 50)
      count = 50; // Spoonacular typically allows up to 100, but 50 is a nice safe limit

    ImportResult result = importService.importRandomRecipes(count);
    return ResponseEntity.ok(result);
  }

  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file)
      throws IOException {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
    }

    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
    }

    String originalName = file.getOriginalFilename();
    String ext = "";
    if (originalName != null && originalName.contains(".")) {
      ext = originalName.substring(originalName.lastIndexOf("."));
    }
    String filename = UUID.randomUUID() + ext;

    Path uploadDir = Path.of("uploads");
    Files.createDirectories(uploadDir);
    Files.copy(
        file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

    String url = "/uploads/" + filename;
    return ResponseEntity.ok(Map.of("url", url));
  }
}
