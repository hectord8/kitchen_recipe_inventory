package com.example.kitchen.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryDTO {


    private Integer customerId;


    private String description;



    @NotNull(message = "Quantity is required")
    @Min(value = 1, message= "Quantity must be bigger then 0")
    private Integer quantity;

    @NotNull(message = "Item id  is required")
    private String item;


    public String getItem() {
        return item;
    }

    public record   QuantityResponse(int item_id, int quantity){

    }
}
