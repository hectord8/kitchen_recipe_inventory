package com.example.kitchen.inventory;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

// @Service
public class OcrService {

  private final WebClient webClient;

  @Value("${ocr.api.key}")
  private String apiKey;

  public OcrService(WebClient.Builder builder) {
    this.webClient = builder.baseUrl("https://api.ocr.space").build();
  }

  public String parse(MultipartFile file) {
    try {
      MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

      ByteArrayResource fileResource =
          new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
              return file.getOriginalFilename();
            }
          };

      body.add("file", fileResource);
      body.add("isOverlayRequired", "false");
      // body.add("OCREngine", "2"); // optional

      Map<String, Object> result =
          webClient
              .post()
              .uri("/parse/image")
              .header("apikey", apiKey)
              .contentType(MediaType.MULTIPART_FORM_DATA)
              .body(BodyInserters.fromMultipartData(body))
              .retrieve()
              .bodyToMono(Map.class)
              .block();

      return extractText(result);

    } catch (Exception e) {
      throw new RuntimeException("OCR failed", e);
    }
  }

  @SuppressWarnings("unchecked")
  private String extractText(Map<String, Object> result) {
    if (result == null) return "";

    List<Map<String, Object>> parsedResults =
        (List<Map<String, Object>>) result.get("ParsedResults");

    if (parsedResults == null) return "";

    StringBuilder sb = new StringBuilder();
    for (Map<String, Object> page : parsedResults) {
      Object text = page.get("ParsedText");
      if (text != null) {
        sb.append(text).append("\n");
      }
    }
    return sb.toString().trim();
  }
}
