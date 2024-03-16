# Use an official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json. This step is separated to utilize caching.
COPY package*.json ./


# Install project dependencies
RUN npm install

# Copy important files from the root
COPY tsconfig.base.json .
COPY nx.json .
COPY jest.preset.js .

# Start the app
CMD ["npm", "run", "payment:dev:docker"]