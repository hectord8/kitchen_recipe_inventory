package com.example.kitchen.inventory;


import com.example.kitchen.recipes.Recipe;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryDAO dao;


    public InventoryController(InventoryDAO dao){
        this.dao = dao;

    }

    @PostMapping("/items")
    public ResponseEntity<Inventory> insert(@RequestBody Inventory inventory){
        Inventory saved = dao.insert(inventory);

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Inventory> getAll() {
        return dao.getAllItems();
    }

    @GetMapping("/items/{customerId}")
    public List<Inventory> getAllItemsByCustomerId(
            @PathVariable("customerId") int customerId
    ) {
        return dao.getAllItemsById(customerId);
    }

    @GetMapping("/item/{itemsId}")
    public InventoryDTO.QuantityResponse getQuantityByItemId(
            @PathVariable("itemsId") int itemsId
    ) {
        return dao.getQuantityByItemId(itemsId);
    }

    @PatchMapping("/item/{itemsId}/increase")
    public ResponseEntity<Inventory> increaseQuantity(
            @PathVariable("itemsId") int itemsId
    ) {
       Inventory increased =  dao.increaseQuantity(itemsId);

        return ResponseEntity.ok(increased);
    }

    @PatchMapping("/item/{itemsId}/decrease")
    public ResponseEntity<Inventory>  decreaseQuantity(
            @PathVariable("itemsId") int itemsId
    ) {
         Inventory decreased = dao.decreaseQuantity(itemsId);
         return ResponseEntity.ok(decreased);
    }




}
