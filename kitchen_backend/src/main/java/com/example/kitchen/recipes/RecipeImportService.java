package com.example.kitchen.recipes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class RecipeImportService {

    private final RecipeDAO recipeDAO;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${spoonacular.base-url}")
    private String spoonacularBaseUrl;

    @Value("${spoonacular.api-key}")
    private String spoonacularApiKey;

    public RecipeImportService(RecipeDAO recipeDAO) {
        this.recipeDAO = recipeDAO;
    }

    public ImportResult importRandomRecipes(int count) {
        try {
            String url = spoonacularBaseUrl + "/recipes/random"
                    + "?number=" + count
                    + "&addRecipeInformation=true"
                    + "&includeNutrition=true"
                    + "&apiKey=" + spoonacularApiKey;

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("Accept", "application/json")
                    .build();


            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() < 200 || resp.statusCode() >= 300) {
                throw new RuntimeException("Spoonacular error: " + resp.statusCode() + " -> " + resp.body());
            }

            JsonNode root = objectMapper.readTree(resp.body());
            JsonNode recipes = root.get("recipes");

            int inserted = 0;
            int skipped = 0;

            if (recipes != null && recipes.isArray()) {
                for (JsonNode r : recipes) {
                    int spoonId = r.path("id").asInt();

                    if (recipeDAO.existsBySpoonacularId(spoonId)) {
                        skipped++;
                        continue;
                    }

                    String title = r.path("title").asText(null);
                    String image = r.path("image").asText(null);
                    String summary = r.path("summary").asText(null);
                    String instructions = r.path("instructions").asText(null);

                    Integer prepMinutes = r.path("preparationMinutes").isMissingNode() || r.path("preparationMinutes").isNull()
                            ? null : r.path("preparationMinutes").asInt();

                    Integer cookMinutes = r.path("cookingMinutes").isMissingNode() || r.path("cookingMinutes").isNull()
                            ? null : r.path("cookingMinutes").asInt();

                    Integer readyMinutes = r.path("readyInMinutes").isMissingNode() || r.path("readyInMinutes").isNull()
                            ? null : r.path("readyInMinutes").asInt();

                    String diet = null;
                    JsonNode dietsNode = r.get("diets");
                    if (dietsNode != null && dietsNode.isArray() && dietsNode.size() > 0) {
                        StringBuilder sb = new StringBuilder();
                        for (int i = 0; i < dietsNode.size(); i++) {
                            if (i > 0) sb.append(",");
                            sb.append(dietsNode.get(i).asText());
                        }
                        diet = sb.toString();
                    }

                    Integer calories = null;
                    JsonNode nutrients = r.path("nutrition").path("nutrients");
                    if (nutrients.isArray()) {
                        for (JsonNode n : nutrients) {
                            if ("Calories".equalsIgnoreCase(n.path("name").asText())) {
                                // amount might be decimal
                                calories = (int) Math.round(n.path("amount").asDouble());
                                break;
                            }
                        }
                    }

                    String creator = "spoonacular";

                    if (title == null || title.isBlank() || image == null || image.isBlank()) {
                        skipped++;
                        continue;
                    }

                    Recipe recipe = new Recipe(
                            spoonId,
                            title,
                            image,
                            summary,
                            instructions,
                            prepMinutes,
                            cookMinutes,
                            readyMinutes,
                            calories,
                            diet,
                            creator
                    );

                    recipeDAO.insert(recipe);
                    inserted++;
                }
            }

            return new ImportResult(inserted, skipped);

        } catch (Exception e) {
            throw new RuntimeException("Import failed: " + e.getMessage(), e);
        }
    }
}
