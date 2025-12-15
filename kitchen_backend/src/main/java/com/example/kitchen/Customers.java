package com.example.kitchen;

import java.util.ArrayList;
import java.util.List;

// Storage class for Customers
public class Customers {

    private List<Customer> CustomerList;

    // Get the Customer list (initialize if null)
    public List<Customer> getCustomerList() {
        if (CustomerList == null) {
            CustomerList = new ArrayList<>();
        }
        return CustomerList;
    }

    public void setCustomerList(List<Customer> CustomerList) {
        this.CustomerList = CustomerList;
    }
}