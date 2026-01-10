package com.example.kitchen.inventory;

import lombok.Data;

@Data
public class Inventory {

    private Integer item_id;
    private Integer customer_Id;
    private String item;
    private String description;
    private String image;
    private Integer quantity;


    public Inventory(){}

    public Inventory(Integer item_id , Integer customer_Id ,String item, String description, String image, Integer quantity){
        this.customer_Id = customer_Id;
        this.item_id = item_id;
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
        return customer_Id;
    }

    public void setCustomerId(Integer customer_Id) {
        this.customer_Id = customer_Id;
    }

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
