# ---- build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY . .

# make wrapper executable (important on Linux/Render)
RUN chmod +x ./gradlew

# build jar
RUN ./gradlew clean build -x test

# ---- run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

# Render provides $PORT
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
