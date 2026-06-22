package com.example.kitchen.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerDto {

  private Integer id;

  @NotBlank(message = "Name cannot be blank")
  private String firstName;

  @NotBlank(message = "Password cannot be blank")
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String password;

  @NotBlank(message = "Email cannot be blank")
  @Email(message = "Email should be valid")
  private String email;
}
