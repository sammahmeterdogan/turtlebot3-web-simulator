FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy gradle files
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY rcp-app/ rcp-app/
COPY rcp-base/ rcp-base/

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Run the application
EXPOSE 8080
CMD ["./gradlew", "bootRun"]
