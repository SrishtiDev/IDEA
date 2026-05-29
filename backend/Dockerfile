FROM ubuntu:22.04

# Prevent interactive prompts during apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, curl, and dependencies required by Tectonic
RUN apt-get update && \
    apt-get install -y curl ca-certificates libfontconfig1 libgraphite2-3 libharfbuzz0b \
                       libharfbuzz-icu0 zlib1g && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Tectonic LaTeX engine via their official bash installer
RUN curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh && \
    mv tectonic /usr/local/bin/

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
