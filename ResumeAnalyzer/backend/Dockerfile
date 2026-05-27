FROM ubuntu:22.04

# Prevent interactive prompts during apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install OpenJDK 17, Maven, and dependencies required by Tectonic
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven curl libfontconfig1 libgraphite2-3 libharfbuzz0b \
                       libharfbuzz-icu0 zlib1g && \
    rm -rf /var/lib/apt/lists/*

# Install Tectonic LaTeX engine via their official bash installer
RUN curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh && \
    mv tectonic /usr/local/bin/

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Pre-build the application to speed up startup
RUN mvn clean package -DskipTests

EXPOSE 8080
CMD ["java", "-jar", "target/resume-analyzer-0.0.1-SNAPSHOT.jar"]
