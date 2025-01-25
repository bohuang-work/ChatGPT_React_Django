# Build and serve stage
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies and serve
# Remove --frozen-lockfile since we don't have a yarn.lock yet
RUN yarn install && \
    yarn global add serve

# Copy source code
COPY . .

# Build the app
RUN yarn build

# Expose port
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "dist", "-l", "3000"] 