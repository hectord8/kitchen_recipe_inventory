package com.example.kitchen.inventory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryDTO {
    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Item id  is required")
    private Integer item_id;

    public record   QuantityResponse(int item_id, int quantity){

    }
}
