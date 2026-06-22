package com.example.kitchen.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

  private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

  private final Map<String, SlidingWindow> windows = new ConcurrentHashMap<>();

  @Value("${app.rate-limit.default:60}")
  private int defaultMaxRequests;

  @Value("${app.rate-limit.auth-login:5}")
  private int loginMaxRequests;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpReq = (HttpServletRequest) request;
    HttpServletResponse httpRes = (HttpServletResponse) response;
    String path = httpReq.getRequestURI();

    if (path.equals("/health")) {
      chain.doFilter(request, response);
      return;
    }

    int maxRequests = path.equals("/auth/login") ? loginMaxRequests : defaultMaxRequests;

    String clientIp = resolveClientIp(httpReq);
    String key = clientIp + ":" + path;

    SlidingWindow window =
        windows.computeIfAbsent(key, k -> new SlidingWindow(maxRequests, Duration.ofMinutes(1)));

    if (!window.tryAcquire()) {
      httpRes.setStatus(429);
      httpRes.setHeader("Retry-After", "60");
      httpRes.setContentType("application/json");
      httpRes.getWriter().write("{\"message\":\"Too many requests. Try again in 60 seconds.\"}");
      log.warn("Rate limit exceeded for {} from {}", path, clientIp);
      return;
    }

    chain.doFilter(request, response);
  }

  private static String resolveClientIp(HttpServletRequest req) {
    String xff = req.getHeader("X-Forwarded-For");
    if (xff != null && !xff.isBlank()) {
      return xff.split(",")[0].trim();
    }
    return req.getRemoteAddr();
  }

  static class SlidingWindow {
    private final int maxRequests;
    private final long windowNanos;
    private final long[] timestamps;
    private int index;

    SlidingWindow(int maxRequests, Duration window) {
      this.maxRequests = maxRequests;
      this.windowNanos = window.toNanos();
      this.timestamps = new long[maxRequests];
      this.index = 0;
    }

    synchronized boolean tryAcquire() {
      long now = System.nanoTime();
      long oldest = now - windowNanos;

      int count = 0;
      for (long ts : timestamps) {
        if (ts >= oldest) count++;
      }

      if (count >= maxRequests) {
        return false;
      }

      timestamps[index % maxRequests] = now;
      index++;
      return true;
    }
  }
}
