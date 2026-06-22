package com.example.kitchen.config;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

  @Test
  void validationReturnsFieldErrors() {
    BeanPropertyBindingResult binding = new BeanPropertyBindingResult(null, "target");
    binding.addError(new FieldError("target", "email", "must be valid"));

    MethodArgumentNotValidException ex =
        new MethodArgumentNotValidException(null, binding);

    ResponseEntity<Map<String, Object>> res = handler.handleValidation(ex);
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());

    Map<String, Object> body = res.getBody();
    assertEquals("Validation failed", body.get("message"));

    @SuppressWarnings("unchecked")
    Map<String, String> errors = (Map<String, String>) body.get("errors");
    assertEquals("must be valid", errors.get("email"));
  }

  @Test
  void malformedJsonReturnsBadRequest() {
    HttpInputMessage emptyInput =
        new HttpInputMessage() {
          @Override
          public java.io.InputStream getBody() {
            return new ByteArrayInputStream(new byte[0]);
          }

          @Override
          public HttpHeaders getHeaders() {
            return HttpHeaders.EMPTY;
          }
        };
    HttpMessageNotReadableException ex =
        new HttpMessageNotReadableException("bad json", emptyInput);
    ResponseEntity<Map<String, Object>> res = handler.handleMalformedJson(ex);
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    assertTrue(res.getBody().get("message").toString().contains("Invalid request body"));
  }

  @Test
  void genericErrorReturns500() {
    Exception ex = new RuntimeException("database went boom");
    ResponseEntity<Map<String, Object>> res = handler.handleGeneric(ex);
    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
    assertEquals("Something went wrong.", res.getBody().get("message"));
  }
}
