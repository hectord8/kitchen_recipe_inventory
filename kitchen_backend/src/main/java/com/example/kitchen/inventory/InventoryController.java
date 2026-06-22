package com.example.kitchen.inventory;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
  private final InventoryDAO dao;
  private final OcrService ocrService;

  public InventoryController(InventoryDAO dao, OcrService ocrService) {
    this.dao = dao;
    this.ocrService = ocrService;
  }

  @PostMapping("/items")
  public ResponseEntity<Inventory> insert(@Valid @RequestBody InventoryDTO dto) {
    Inventory inventory = new Inventory();
    inventory.setItem(dto.getItem());
    inventory.setCustomerId(dto.getCustomerId());
    inventory.setDescription(dto.getDescription());
    inventory.getImage();
    inventory.setQuantity(dto.getQuantity());

    Inventory saved = dao.insert(inventory);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public List<Inventory> getAll() {
    return dao.getAllItems();
  }

  @GetMapping("/items/{customerId}")
  public List<Inventory> getAllItemsByCustomerId(@PathVariable("customerId") int customerId) {
    return dao.getAllItemsById(customerId);
  }

  @GetMapping("/item/{itemsId}")
  public InventoryDTO.QuantityResponse getQuantityByItemId(@PathVariable("itemsId") int itemsId) {
    return dao.getQuantityByItemId(itemsId);
  }

  @PatchMapping("/item/{itemsId}/increase")
  public int increaseQuantity(@PathVariable("itemsId") int itemsId) {

    return dao.increaseQuantity(itemsId);
  }

  @PatchMapping("/item/{itemsId}/decrease")
  public int decreaseQuantity(@PathVariable("itemsId") int itemsId) {

    return dao.decreaseQuantity(itemsId);
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file) {

    String text = ocrService.parse(file);
    return ResponseEntity.ok(Map.of("text", text));
  }
}
