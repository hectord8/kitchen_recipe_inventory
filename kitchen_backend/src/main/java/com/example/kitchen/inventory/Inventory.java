package com.example.kitchen.inventory;

import lombok.Data;

@Data
public class Inventory {

    private Integer itemId;
    private Integer customerId;
    private String item;
    private String description;
    private String image;
    private Integer quantity;


    public Inventory(){}

    public Inventory(Integer itemId , Integer customerId ,String item, String description, String image, Integer quantity){
        this.customerId = customerId;
        this.itemId = itemId;
        this.item = item;
        this.description = description;
        this.image = image;
        this.quantity = quantity;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getItem_id() {
        return itemId;
    }

    public void setItem_id(Integer item_id) {
        this.itemId = item_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
